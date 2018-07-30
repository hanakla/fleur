import { ComponentContext, StoreClass } from '@ragg/fleur'
import * as React from 'react'

import withComponentContext from './withComponentContext'

type StoreToPropMapper<P, T> = (context: ComponentContext, props: P) => T

type ConnectedComponent<Props, MappedProps> = React.ComponentClass<Pick<Props, Exclude<keyof Props, keyof MappedProps>>>

export interface StoreHandlerProps {
    mapStoresToProps: (...args: any[]) => any
    context: ComponentContext,
    stores: StoreClass[],
    childComponent: React.ComponentClass
}

interface StoreHandlerState {
    childrenProps: any
}

class StoreHandler extends React.PureComponent<StoreHandlerProps, StoreHandlerState> {
    public static getDerivedStateFromProps(nextProps: StoreHandlerProps, prevState: StoreHandlerState): StoreHandlerState {
        return {
            childrenProps: nextProps.mapStoresToProps(nextProps.context, prevState.childrenProps)
        }
    }

    public state: any = { childrenProps: {} }

    public componentDidMount(): any {
        const { context, stores, mapStoresToProps} = this.props

        stores.forEach(store => {
            context.getStore(store).on('onChange', () => {
                this.setState({ childrenProps: mapStoresToProps(context, this.props) })
            })
        })
    }

    public render(): any {
        const { childComponent } = this.props
        return React.createElement(childComponent, { ...this.state.childrenProps })
    }
}

const connectToStores = <Props, MappedProps = {}>(stores: StoreClass[], mapStoresToProps: StoreToPropMapper<Props, MappedProps>) => (
    <ComponentProps extends object>(Component: React.ComponentClass<ComponentProps>): ConnectedComponent<ComponentProps, MappedProps> => (
        class ConnectToStoreComponent extends React.PureComponent<Pick<ComponentProps, Exclude<keyof ComponentProps, keyof MappedProps>>> {
            public render() {
                return (
                    React.createElement(withComponentContext(StoreHandler), {
                        mapStoresToProps,
                        stores,
                        childComponent: Component,
                    })
                )
            }
        }
    )
)

export { connectToStores as default }
