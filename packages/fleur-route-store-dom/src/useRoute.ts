import { useStore } from '@ragg/fleur-react'
import { RouteStore } from './RouteStore'

export const useRoute = () => {
  const route = useStore([RouteStore], getStore => ({
    route: getStore(RouteStore).getCurrentRoute(),
    error: getStore(RouteStore).getCurrentNavigateError(),
  }))

  return route
}
