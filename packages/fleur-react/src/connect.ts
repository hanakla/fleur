import { useState, createElement } from 'react'
import { WithRef } from './WithRef'

type ConnectedComponent<Props, MappedProps> = React.ComponentType<
  WithRef<Pick<Props, Exclude<keyof Props, keyof MappedProps>>>
>

type StateToPropsMapper<T> = (state: T) => any

export const connect = <T extends StateToPropsMapper<any>>(stateToProps: T) => {
  return <ComponentProps extends object>(
    Component: React.ComponentType<ComponentProps>,
  ): ConnectedComponent<ComponentProps, ReturnType<T>> => {
    return (props: any) => {
      const state = useState(stateToProps)
      return createElement(Component, { ...props, ...state })
    }
  }
}
