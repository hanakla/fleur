import { OperationContext } from '@fleur/fleur'
import { Action } from 'history'

export interface Route {
  path: string
  action?: (
    context: OperationContext,
    route: MatchedRoute,
  ) => Promise<any> | void
  handler(): Promise<any>
  meta?: any
}

export interface MatchedRoute {
  type?: Action
  name: string
  url: string
  params: { [prop: string]: string }
  query: { [prop: string]: string | string[] | undefined }
  meta: any
  /** handler is null in RouteStore.{getRoute(), progressRoute} */
  handler: any
  config: Route
}

export interface RouteDefinitions {
  [routeName: string]: Route
}
