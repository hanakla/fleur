import { operation, OperationContext } from '@ragg/fleur'
import { Action } from 'history'
import { navigateFailure, navigateStart, navigateSuccess } from './actions'
import RouteStore from './RouteStore'

export const navigateOperation = operation(
  async (
    context: OperationContext<any>,
    {
      url,
      type,
    }: {
      url: string
      type?: Action
    },
  ) => {
    const routeStore = context.getStore(RouteStore)

    context.dispatch(navigateStart, { url, type })

    const route = routeStore.getRoute(url)

    if (!route) {
      context.dispatch(navigateFailure, {
        type,
        url,
        error: Object.assign(new Error(`URL ${url} not found in any routes`), {
          statusCode: 404,
        }),
      })

      return
    }

    try {
      if (route.config.action) {
        await Promise.resolve(route.config.action(context, route))
      }

      context.dispatch(navigateSuccess, { type, url })
    } catch (e) {
      context.dispatch(navigateFailure, {
        type,
        url,
        error: Object.assign(e, { statusCode: 500 }),
      })
    }
  },
)