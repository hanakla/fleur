import { ComponentContext, StoreClass } from '@ragg/fleur'
import * as React from 'react'

import withComponentContext from './withComponentContext'

export type StoreGettter = ComponentContext['getStore']

type StoreToPropMapper<P, T> = (getStore: StoreGettter, props: P) => T

type ConnectedComponent<Props, MappedProps> = React.ComponentClass<
  Pick<Props, Exclude<keyof Props, keyof MappedProps>>
>

export interface StoreHandlerProps {
  mapStoresToProps: (...args: any[]) => any
  context: ComponentContext
  stores: StoreClass[]
  childProps: any
  childComponent: React.ComponentType
}

interface StoreHandlerState {
  childProps: any
}

const StoreHandler = withComponentContext(
  class StoreHandler extends React.Component<
    StoreHandlerProps,
    StoreHandlerState
  > {
    public static getDerivedStateFromProps(
      nextProps: StoreHandlerProps,
    ): StoreHandlerState {
      return {
        childProps: {
          ...nextProps.childProps,
          ...nextProps.mapStoresToProps(
            nextProps.context.getStore,
            nextProps.childProps,
          ),
        },
      }
    }

    public state: any = { childProps: {} }

    public componentWillUnmount() {
      const { stores, context } = this.props

      stores.forEach(store => {
        context.getStore(store).off('onChange', this.mapStoresToProps)
      })
    }

    public componentDidMount() {
      const { context, stores } = this.props

      stores.forEach(store => {
        context.getStore(store).on('onChange', this.mapStoresToProps)
      })
    }

    private mapStoresToProps = () => {
      const { context, mapStoresToProps } = this.props
      this.setState({ childProps: mapStoresToProps(context, this.props) })
    }

    public render(): any {
      const { childComponent } = this.props
      return React.createElement(childComponent, { ...this.state.childProps })
    }
  },
)

const connectToStores = <Props, MappedProps = {}>(
  stores: StoreClass[],
  mapStoresToProps: StoreToPropMapper<Props, MappedProps>,
) => <ComponentProps extends object>(
  Component: React.ComponentType<ComponentProps>,
): ConnectedComponent<ComponentProps, MappedProps> =>
  class ConnectToStoreComponent extends React.Component<
    Pick<ComponentProps, Exclude<keyof ComponentProps, keyof MappedProps>>
  > {
    public render() {
      return React.createElement(StoreHandler, {
        mapStoresToProps,
        stores,
        childProps: this.props,
        childComponent: Component,
      })
    }
  }

export { connectToStores as default }
