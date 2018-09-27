import { OperationContext } from '@ragg/fleur'

export interface Route {
    path: string
    action?: (context: OperationContext<any>, route: MatchedRoute) => Promise<any> | void
    handler: any
    meta?: any
}

export interface MatchedRoute {
    name: string
    url: string
    params: { [prop: string]: string }
    query: { [prop: string]: string | string[] | undefined }
    config: Route
}

export interface RouteDefinitions {
    [routeName: string]: Route
}
