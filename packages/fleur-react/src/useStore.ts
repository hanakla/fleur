import { useCallback, useEffect, useLayoutEffect, useReducer } from 'react'

import { StoreClass } from '@ragg/fleur'
import { useComponentContext } from './useComponentContext'
import { StoreGetter } from './connectToStores'

type StoreToPropMapper = (getStore: StoreGetter) => any

const canUseDOM = typeof window !== 'undefined'

const useIsomorphicEffect = canUseDOM ? useLayoutEffect : useEffect

const bounce = (fn: () => void, bounceTime: number) => {
  let lastExecuteTime = 0

  return () => {
    const now = Date.now()

    if (now - lastExecuteTime > bounceTime) {
      fn()
      lastExecuteTime = now
    }
  }
}

export const useStore = <Mapper extends StoreToPropMapper>(
  stores: StoreClass[],
  mapStoresToProps: Mapper,
): ReturnType<Mapper> => {
  const { getStore } = useComponentContext()

  const [, rerender] = useReducer(s => s + 1, 0)

  const mapStoresToState = () => rerender({})

  const changeHandler = useCallback(
    // Synchronous mapping on SSR
    canUseDOM ? bounce(mapStoresToState, 10) : mapStoresToState,
    [],
  )

  useIsomorphicEffect(() => {
    stores.forEach(store => {
      getStore(store).on('onChange', changeHandler)
    })

    return () => {
      stores.forEach(store => {
        getStore(store).off('onChange', changeHandler)
      })
    }
  }, [])

  return mapStoresToProps(getStore)
}
