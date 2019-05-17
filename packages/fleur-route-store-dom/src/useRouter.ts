import { useStore } from '@ragg/fleur-react'
import { RouteStore } from './RouteStore'
import { useRouterContext } from './RouterContext'

export const useRouter = () => {
  const routerContext = useRouterContext()

  const route = useStore([RouteStore], getStore => ({
    route: getStore(RouteStore).getCurrentRoute(),
    error: getStore(RouteStore).getCurrentNavigateError(),
  }))

  return { ...route, routerContext }
}
