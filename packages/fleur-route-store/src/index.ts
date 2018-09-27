import RouteStore from './RouteStore'
import { RouteDefinitions } from './types'

export const withStaticRoutes = <R extends RouteDefinitions>(routes: R): {
    storeName: string
    new(...args: any[]): RouteStore<R>
} => {
    return class StaticRouteStore extends RouteStore<R> {
        public static storeName = 'fleur-route-store/RouteStore'

        constructor() {
            super()
            this.routes = routes
        }
    }
}

export { navigateOperation } from './navigateOperation'
export { RouteStore, RouteDefinitions }
export { MatchedRoute } from './types'
export { Link } from './Link'
