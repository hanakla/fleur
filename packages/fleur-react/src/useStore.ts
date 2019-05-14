import { useCallback, useEffect, useState, useLayoutEffect } from 'react'

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

  const [state, setState] = useState<ReturnType<Mapper>>(
    mapStoresToProps(getStore),
  )

  const mapStoresToState = () => setState(mapStoresToProps(getStore))

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

  return state
}
