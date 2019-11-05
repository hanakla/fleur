import { useStore } from '@fleur/react'
import { RouteStore } from './RouteStore'
import { useRouterContext } from './RouterContext'
import invariant from 'invariant'

export const useRoute = () => {
  const routerContext = useRouterContext()

  invariant(routerContext, 'useRoute can use only under RouterContext')

  const { route, error } = useStore(getStore => {
    const { currentRoute: route } = getStore(RouteStore)

    return {
      route,
      params: route ? route.params : {},
      query: route ? route.query : {},
      error: getStore(RouteStore).currentNavigateError,
    }
  })

  return { route, error, routerContext: routerContext.routerContext }
}
