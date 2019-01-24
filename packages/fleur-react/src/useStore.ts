import { useEffect, useState } from 'react'
import { useComponentContext } from './useComponentContext'
import { StoreClass } from '@ragg/fleur'
import { StoreGetter } from './connectToStores'
import { useCallback } from 'react'

type StoreToPropMapper = (getStore: StoreGetter) => any

export const useStore = <Mapper extends StoreToPropMapper>(
  stores: StoreClass[],
  mapStoresToProps: Mapper,
): ReturnType<Mapper> => {
  const context = useComponentContext()
  const [state, setState] = useState<ReturnType<Mapper>>(
    mapStoresToProps(context.getStore),
  )

  const mapper = useCallback(
    () => setState(mapStoresToProps(context.getStore)),
    [],
  )

  useEffect(() => {
    stores.forEach(store => {
      context.getStore(store).on('onChange', mapper)
    })

    return () => {
      stores.forEach(store => {
        context.getStore(store).off('onChange', mapper)
      })
    }
  })

  return state
}
