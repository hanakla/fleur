import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useRef,
} from 'react'
import { StoreClass, StoreGetter } from '@fleur/fleur'
import { useFleurContext } from './useFleurContext'

type StoreToPropMapper = (getStore: StoreGetter) => any

const canUseDOM = typeof window !== 'undefined'

const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect

const bounce = (fn: () => void, bounceTime: number) => {
  let lastExecuteTime = 0

  const bouncer = () => {
    const now = Date.now()

    if (now - lastExecuteTime > bounceTime) {
      fn()
      lastExecuteTime = now
    } else {
      setTimeout(bouncer, bounceTime)
    }
  }

  return bouncer
}

export const useStore = <Mapper extends StoreToPropMapper>(
  mapStoresToProps: Mapper,
): ReturnType<Mapper> => {
  const { getStore } = useFleurContext()
  const referencedStores = useRef<Set<StoreClass>>(new Set())

  const [, rerender] = useReducer(s => s + 1, 0)

  const mapStoresToState = () => rerender({})

  const changeHandler = useCallback(
    // Synchronous mapping on SSR
    canUseDOM ? bounce(mapStoresToState, 10) : mapStoresToState,
    [],
  )

  const getStoreInspector = useCallback(
    <T extends StoreClass>(storeClass: T) => {
      if (!referencedStores.current.has(storeClass)) {
        referencedStores.current.add(storeClass)
        getStore(storeClass).on('onChange', changeHandler)
      }

      return getStore(storeClass)
    },
    [getStore],
  )

  useIsomorphicLayoutEffect(() => {
    return () => {
      referencedStores.current.forEach(store => {
        getStore(store).off('onChange', changeHandler)
      })
    }
  }, [changeHandler])

  return mapStoresToProps(getStoreInspector)
}
