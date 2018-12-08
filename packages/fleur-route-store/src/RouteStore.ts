import { listen, Store } from '@ragg/fleur'
import * as pathToRegexp from 'path-to-regexp'
import * as qs from 'querystring'
import * as url from 'url'

import {
  navigateFailure,
  navigateStart,
  navigateSuccess,
  NavigationPayload,
} from './actions'
import { MatchedRoute, RouteDefinitions } from './types'

export interface State {
  currentRoute: MatchedRoute | null
  error: Error | null
  isComplete: boolean
}

export default class RouteStore<R extends RouteDefinitions> extends Store<
  State
> {
  public static storeName = 'fleur-route-store/RouteStore'

  protected state: State = {
    currentRoute: null,
    error: null,
    isComplete: false,
  }

  protected routes: RouteDefinitions

  // @ts-ignore
  private handleNavigateStart = listen(
    navigateStart,
    ({ url }: NavigationPayload) => {
      this.updateWith(draft => {
        draft.error = null
        draft.isComplete = false
      })
    },
  )

  // @ts-ignore
  private handleNavigationSuccess = listen(
    navigateSuccess,
    ({ type, url, method }: NavigationPayload) => {
      const currentRoute = this.state.currentRoute || { name: null }
      const nextRoute = this.matchRoute(url)

      if (nextRoute && nextRoute.name === currentRoute.name) {
        return
      }

      this.updateWith(draft => {
        draft.currentRoute = nextRoute ? { ...nextRoute, type } : null
        draft.error = null
        draft.isComplete = true
      })
    },
  )

  // @ts-ignore
  private handleNavigationFailure = listen(
    navigateFailure,
    ({ error }: NavigationPayload) => {
      this.updateWith(draft => {
        draft.error = error || null
        draft.isComplete = true
      })
    },
  )

  public rehydrate(state: State) {
    this.updateWith(draft => {
      Object.assign(draft, state)
      draft.currentRoute = state.currentRoute
        ? this.getRoute(state.currentRoute.url)
        : null
    })
  }

  public dehydrate(): State {
    return this.state
  }

  public makePath(
    routeName: keyof R,
    params: object = {},
    query: object = {},
  ): string {
    const path = this.routes[routeName as string]
    if (!path) throw new Error(`Matched route name not found: ${routeName}`)

    const pathname = pathToRegexp.compile(path.path)(params)
    return url.format({ pathname: pathname, query })
  }

  public getCurrentRoute(): MatchedRoute | null {
    return this.state.currentRoute
  }

  public getCurrentNavigateError(): Error | null {
    return this.state.currentRoute && this.state.error
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
        config: route,
      }
    }

    return null
  }
}
