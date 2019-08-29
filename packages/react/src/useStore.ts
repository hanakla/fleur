import { useCallback, useEffect, useLayoutEffect, useReducer } from 'react'

import { StoreClass, StoreGetter } from '@fleur/fleur'
import { useFleurContext } from './useFleurContext'

type StoreToPropMapper = (getStore: StoreGetter) => any

const canUseDOM = typeof window !== 'undefined'

const useIsomorphicEffect = canUseDOM ? useLayoutEffect : useEffect

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
  stores: StoreClass[],
  mapStoresToProps: Mapper,
): ReturnType<Mapper> => {
  const { getStore, getStoreInstance } = useFleurContext()

  const [, rerender] = useReducer(s => s + 1, 0)

  const mapStoresToState = () => rerender({})

  const changeHandler = useCallback(
    // Synchronous mapping on SSR
    canUseDOM ? bounce(mapStoresToState, 10) : mapStoresToState,
    [],
  )

  useIsomorphicEffect(() => {
    stores.forEach(store => {
      getStoreInstance(store).on('onChange', changeHandler)
    })

    return () => {
      stores.forEach(store => {
        getStoreInstance(store).off('onChange', changeHandler)
      })
    }
  }, [])

  return mapStoresToProps(getStore)
}
