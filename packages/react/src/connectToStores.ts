import { StoreGetter } from '@fleur/fleur'
import * as React from 'react'

import { useStore } from './useStore'
import { WithRef } from './WithRef'

type StoreToPropMapper<P, T> = (getStore: StoreGetter, props: P) => T

type ConnectedComponent<Props, MappedProps> = React.ComponentType<
  Pick<Props, Exclude<keyof Props, keyof MappedProps>> & {}
>

export const connectToStores = <Props, MappedProps = {}>(
  mapStoresToProps: StoreToPropMapper<Props, MappedProps>,
) => <ComponentProps extends object>(
  Component: React.ComponentType<ComponentProps>,
): ConnectedComponent<WithRef<ComponentProps>, MappedProps> => {
  return React.forwardRef((props: any, ref) => {
    const mappedProps = useStore(getStore => mapStoresToProps(getStore, props))

    return React.createElement(Component, { ref, ...props, ...mappedProps })
  })
}
