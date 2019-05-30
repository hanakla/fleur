import { useCallback, useEffect, useLayoutEffect, useReducer } from 'react'

import { StoreClass } from '@fleur/fleur'
import { useFleurContext } from './useFleurContext'
import { StoreGetter } from './connectToStores'
import { canUseDOM, useIsomorphicEffect, bounce } from './utils'

type StoreToPropMapper = (getStore: StoreGetter) => any

export const useStore = <Mapper extends StoreToPropMapper>(
  stores: StoreClass[],
  mapStoresToProps: Mapper,
): ReturnType<Mapper> => {
  const { getStore } = useFleurContext()

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
