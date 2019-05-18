import { useStore } from '@ragg/fleur-react'
import { RouteStore } from './RouteStore'
import { useRouterContext } from './RouterContext'

export const useRoute = () => {
  const routerContext = useRouterContext()

  const { route, error } = useStore([RouteStore], getStore => {
    const route = getStore(RouteStore).getCurrentRoute()
    return {
      route,
      params: route ? route.params : {},
      query: route ? route.query : {},
      error: getStore(RouteStore).getCurrentNavigateError(),
    }
  })

  return { route, error, routerContext }
}
