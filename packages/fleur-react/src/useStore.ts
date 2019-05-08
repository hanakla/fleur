import { useCallback, useEffect, useState, useLayoutEffect } from 'react'

import { StoreClass } from '@ragg/fleur'
import { useComponentContext } from './useComponentContext'
import { StoreGetter } from './connectToStores'

type StoreToPropMapper = (getStore: StoreGetter) => any

const useIsomorphicEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const useStore = <Mapper extends StoreToPropMapper>(
  stores: StoreClass[],
  mapStoresToProps: Mapper,
): ReturnType<Mapper> => {
  const { getStore } = useComponentContext()

  const [state, setState] = useState<ReturnType<Mapper>>(
    mapStoresToProps(getStore),
  )

  const mapper = useCallback(() => {
    setState(mapStoresToProps(getStore))
  }, [])

  useIsomorphicEffect(() => {
    stores.forEach(store => {
      getStore(store).on('onChange', mapper)
    })

    return () => {
      stores.forEach(store => {
        getStore(store).off('onChange', mapper)
      })
    }
  }, [])

  return state
}
