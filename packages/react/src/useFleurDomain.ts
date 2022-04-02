import { Operation, OperationArgs, StoreClass } from '@fleur/fleur'
import React, { useCallback, useMemo, useReducer, useRef } from 'react'
import { useInternalFleurContext } from './useFleurContext'
import {
  useIsomorphicLayoutEffect,
  canUseDOM,
  bounce,
  isEqual,
} from './utils/utils'

type StateOfStore<S extends StoreClass<S>> = S extends StoreClass<infer R>
  ? R
  : never

export const useFleurDomain = <
  S extends StoreClass<any>,
  O extends { [k: string]: Operation }
>(
  Store: S,
  ops: O,
  checkEquality:
    | ((prev: StateOfStore<S>, next: StateOfStore<S>) => boolean)
    | null = isEqual,
): [
  StateOfStore<S>,
  { [K in keyof O]: (...args: OperationArgs<O[K]>) => void },
] => {
  const {
    context: { getStore, executeOperation },
    synchronousUpdate,
  } = useInternalFleurContext()

  const isMounted = useRef<boolean>(false)
  const latestState = useRef<StateOfStore<S> | null>(null)
  const [, rerender] = useReducer((s) => s + 1, 0)

  const bindedOps = useMemo(
    () =>
      Object.keys(ops).reduce(
        (binded, key) =>
          Object.assign(binded, {
            [key]: (...args: any) => executeOperation(ops[key], ...args),
          }),
        Object.create(null),
      ),
    [
      /* ignore ops set changing */
    ],
  )

  const handleStoreMutation = useCallback(() => {
    const nextState = getStore(Store).state

    if (checkEquality?.(latestState.current!, nextState)) return
    latestState.current = nextState

    rerender()
  }, [Store])

  useIsomorphicLayoutEffect(() => {
    isMounted.current = true

    const bounced =
      // Synchronous mapping on SSR
      canUseDOM && !synchronousUpdate
        ? bounce(handleStoreMutation, 10)
        : handleStoreMutation

    getStore(Store).on(bounced)

    return () => {
      getStore(Store).off(bounced)
    }
  }, [handleStoreMutation, synchronousUpdate])

  return [getStore(Store).state, bindedOps]
}
