import React, { forwardRef } from 'react'
import { useRoute } from './useRoute'
import { MatchedRoute } from './types'
import { RouterContext } from './RouterContext'

export interface RouteProps {
  route: MatchedRoute | null
  routeError: Error | null
  routerContext: RouterContext
}

type PropsWithoutRouteProp<P> = Pick<P, Exclude<keyof P, keyof RouteProps>>

export const withRoute = <P extends RouteProps>(
  Component: React.ComponentType<P>,
) => {
  return forwardRef((props: PropsWithoutRouteProp<P>, ref) => {
    const { route, routerContext, error } = useRoute()

    return React.createElement(Component, {
      ref,
      ...(props as any),
      route,
      routeError: error,
      routerContext: routerContext,
    })
  })
}
