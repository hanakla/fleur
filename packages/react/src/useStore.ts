import { useCallback, useReducer, useRef } from 'react'
import { StoreClass, StoreGetter } from '@fleur/fleur'
import { useInternalFleurContext } from './useFleurContext'
import {
  canUseDOM,
  isEqual,
  useIsomorphicLayoutEffect,
  bounce,
} from './utils/utils'

type StoreToPropMapper = (getStore: StoreGetter) => any

export const useStore = <Mapper extends StoreToPropMapper>(
  mapStoresToProps: Mapper,
  checkEquality:
    | ((
        prev: Readonly<ReturnType<Mapper>>,
        next: Readonly<ReturnType<Mapper>>,
      ) => boolean)
    | null = isEqual,
): ReturnType<Mapper> => {
  const {
    context: { getStore },
    synchronousUpdate,
  } = useInternalFleurContext()

  const referencedStores = useRef<Set<StoreClass>>(new Set())
  const isMounted = useRef<boolean>(false)
  const [, rerender] = useReducer((s) => s + 1, 0)

  const getStoreInspector = useCallback(
    <T extends StoreClass>(storeClass: T) => {
      if (!referencedStores.current.has(storeClass)) {
        referencedStores.current.add(storeClass)

        if (isMounted.current) {
          getStore(storeClass).on(bouncedHandleStoreMutation)
        }
      }

      return getStore(storeClass)
    },
    [getStore],
  )

  const latestState = useRef<ReturnType<Mapper> | null>(null)
  const latestSelector = useRef<Mapper>(mapStoresToProps)

  if (!latestState.current || latestSelector.current !== mapStoresToProps) {
    latestState.current = mapStoresToProps(getStoreInspector)
    latestSelector.current = mapStoresToProps
  }

  const handleStoreMutation = useCallback(() => {
    const nextState = mapStoresToProps(getStoreInspector)

    if (checkEquality?.(latestState.current!, nextState)) return
    latestState.current = nextState

    rerender()
  }, [mapStoresToProps, getStoreInspector])

  const bouncedHandleStoreMutation = useCallback(
    // Synchronous mapping on SSR
    canUseDOM && !synchronousUpdate
      ? bounce(handleStoreMutation, 10)
      : handleStoreMutation,
    [handleStoreMutation, synchronousUpdate],
  )

  useIsomorphicLayoutEffect(() => {
    isMounted.current = true

    referencedStores.current.forEach((store) => {
      getStore(store).on(bouncedHandleStoreMutation)
    })

    return () => {
      referencedStores.current.forEach((store) => {
        getStore(store).off(bouncedHandleStoreMutation)
      })
    }
  }, [bouncedHandleStoreMutation])

  return latestState.current as ReturnType<Mapper>
}
