import { listen, Store } from '@ragg/fleur'
import pathToRegexp from 'path-to-regexp'
import qs from 'querystring'
import url from 'url'

import { NavigationActions } from './actions'
import { MatchedRoute, RouteDefinitions } from './types'

export interface State {
  progressRoute: MatchedRoute | null
  currentRoute: MatchedRoute | null
  error: Error | null
  isComplete: boolean
}

export class RouteStore extends Store<State> {
  public static storeName = 'fleur-route-store-dom/RouteStore'

  protected state: State = {
    progressRoute: null,
    currentRoute: null,
    error: null,
    isComplete: false,
  }

  protected routes: RouteDefinitions

  // @ts-ignore
  private handleNavigationStart = listen(
    NavigationActions.navigateStart,
    ({ url, type }) => {
      const progressNavigate = this.matchRoute(url)

      this.updateWith(draft => {
        draft.progressRoute = progressNavigate
          ? { ...progressNavigate, handler: null, type }
          : null
        draft.error = null
        draft.isComplete = false
      })
    },
  )

  // @ts-ignore
  private handleNavigationSuccess = listen(
    NavigationActions.navigateSuccess,
    ({ type, url, handler }) => {
      const nextRoute = this.matchRoute(url)

      this.updateWith(state => {
        state.progressRoute = null
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
        state.progressRoute = null
        state.currentRoute = null
        state.error = error || null
        state.isComplete = true
      })
    },
  )

  public rehydrate() {}

  public dehydrate() {
    // No dehydrate the state.
    // On SSR, `handler` property is not serializable to JSON
    // It raises broken Client-side state.
    return {}
  }

  public get progressRoute(): MatchedRoute | null {
    return this.state.progressRoute
  }

  public get currentRoute(): MatchedRoute | null {
    return this.state.currentRoute
  }

  public get currentNavigateError(): Error | null {
    return this.state.error
  }

  public get isNavigateComplete(): boolean {
    return this.state.isComplete
  }

  public get allRoutes() {
    return this.routes
  }

  public getRoute(url: string): MatchedRoute | null {
    return this.matchRoute(url)
  }

  public isCurrentRoute(href: string) {
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
