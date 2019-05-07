import { ComponentContext, StoreClass } from '@ragg/fleur'
import * as React from 'react'

import { useComponentContext } from './useComponentContext'

export type StoreGetter = ComponentContext['getStore']

type StoreToPropMapper<P, T> = (getStore: StoreGetter, props: P) => T

type ConnectedComponent<Props, MappedProps> = React.ComponentType<
  Pick<Props, Exclude<keyof Props, keyof MappedProps>>
>

export interface StoreHandlerProps {
  mapStoresToProps: (...args: any[]) => any
  context: ComponentContext
  stores: StoreClass[]
  childProps: any
  childComponent: React.ComponentType
}

const connectToStores = <Props, MappedProps = {}>(
  stores: StoreClass[],
  mapStoresToProps: StoreToPropMapper<Props, MappedProps>,
) => <ComponentProps extends object>(
  Component: React.ComponentType<ComponentProps>,
): ConnectedComponent<ComponentProps, MappedProps> => {
  return (props: any) => {
    const context = useComponentContext()

    const [mappedProps, setState] = React.useState(
      mapStoresToProps(context.getStore, props),
    )

    const mapStoresToState = React.useCallback(
      () => setState(mapStoresToProps(context.getStore, props)),
      [mapStoresToProps],
    )

    React.useEffect(() => {
      stores.forEach(store => {
        context.getStore(store).on('onChange', mapStoresToState)
      })

      return () => {
        stores.forEach(store => {
          context.getStore(store).off('onChange', mapStoresToState)
        })
      }
    }, [])

    return React.createElement(Component, { ...props, ...mappedProps })
  }
}
export { connectToStores as default }
