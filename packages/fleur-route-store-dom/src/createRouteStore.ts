import { StoreContext } from '@ragg/fleur'
import qs from 'querystring'
import pathToRegexp from 'path-to-regexp'
import url from 'url'

import { RouteDefinitions } from './types'
import { RouteStore, RouteStoreClass } from './RouteStore'

export const createRouteStore = <R extends RouteDefinitions>(
  routes: R,
): RouteStoreClass<R> => {
  return class StaticRouteStore extends RouteStore {
    public static storeName = 'fleur-route-store-dom/RouteStore'

    public static makePath(
      routeName: keyof R,
      params: object = {},
      query: qs.ParsedUrlQueryInput = {},
    ): string {
      const path = routes[routeName as string]
      if (!path) throw new Error(`Matched route name not found: ${routeName}`)

      const pathname = pathToRegexp.compile(path.path)(params)
      return url.format({ pathname: pathname, query })
    }

    constructor(context: StoreContext) {
      super(context)
      this.routes = routes
    }
  }
}
