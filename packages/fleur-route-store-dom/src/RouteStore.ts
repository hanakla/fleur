import { listen, Store, StoreContext } from '@ragg/fleur'
import pathToRegexp from 'path-to-regexp'
import qs from 'querystring'
import url from 'url'

import { NavigationActions } from './actions'
import { MatchedRoute, RouteDefinitions } from './types'

export interface State {
  currentRoute: MatchedRoute | null
  error: Error | null
  isComplete: boolean
}

export interface RouteStoreClass<R extends RouteDefinitions> {
  storeName: string

  makePath(
    routeName: keyof R,
    params?: object,
    query?: qs.ParsedUrlQueryInput,
  ): string

  new (context: StoreContext): RouteStore
}

export class RouteStore extends Store<State> {
  public static storeName = 'fleur-route-store-dom/RouteStore'

  protected state: State = {
    currentRoute: null,
    error: null,
    isComplete: false,
  }

  protected routes: RouteDefinitions

  // @ts-ignore
  private handleNavigateStart = listen(NavigationActions.navigateStart, () => {
    this.updateWith(draft => {
      draft.error = null
      draft.isComplete = false
    })
  })

  // @ts-ignore
  private handleNavigationSuccess = listen(
    NavigationActions.navigateSuccess,
    ({ type, url, handler }) => {
      const nextRoute = this.matchRoute(url)

      this.updateWith(state => {
        state.currentRoute = nextRoute ? { ...nextRoute, handler, type } : null
        state.error = null
        state.isComplete = true
      })
    },
  )

  // @ts-ignore
  private handleNavigationFailure = listen(
    NavigationActions.navigateFailure,
    ({ error }) => {
      this.updateWith(state => {
        state.currentRoute = null
        state.error = error || null
        state.isComplete = true
      })
    },
  )

  public rehydrate() {}

  public dehydrate() {
    return {}
  }

  public getCurrentRoute(): MatchedRoute | null {
    return this.state.currentRoute
  }

  public getCurrentNavigateError(): Error | null {
    return this.state.error
  }

  public isNavigationComplete(): boolean {
    return this.state.isComplete
  }

  public getRoute(url: string): MatchedRoute | null {
    return this.matchRoute(url)
  }

  public getRoutes() {
    return this.routes
  }

  public isActive(href: string) {
    const { currentRoute } = this.state
    return !!(currentRoute && currentRoute.url === href)
  }

  private matchRoute(inputUrl: string): MatchedRoute | null {
    const indexOfHash = inputUrl.indexOf('#')

    const urlWithoutHash =
      indexOfHash !== -1 ? inputUrl.slice(0, indexOfHash) : inputUrl
    const parsed = url.parse(urlWithoutHash)

    const params = Object.create(null)
    for (const routeName of Object.keys(this.routes)) {
      const keys: pathToRegexp.Key[] = []
      const matcher = pathToRegexp(this.routes[routeName].path, keys)
      const match = matcher.exec(parsed.pathname!)
      if (!match) continue

      const route = this.routes[routeName]
      for (let idx = 1; idx < match.length; idx++) {
        params[keys[idx - 1].name] = match[idx]
      }

      return {
        name: routeName,
        url: urlWithoutHash,
        params,
        query: qs.parse(parsed.query!),
        handler: null,
        meta: { ...route.meta },
        config: route,
      }
    }

    return null
  }
}
