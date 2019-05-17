import { operation, OperationContext } from '@ragg/fleur'
import { Action } from 'history'
import { navigateFailure, navigateStart, navigateSuccess } from './actions'
import { RouteStore } from './RouteStore'

export const navigateOp = operation(
  async (
    context: OperationContext,
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
      const [, handler] = await Promise.all([
        route.config.action
          ? Promise.resolve(route.config.action(context, route))
          : Promise.resolve(),
        route.config.handler
          ? Promise.resolve(route.config.handler()).then(mod =>
              mod.default ? mod.default : mod,
            )
          : Promise.resolve(),
      ])

      context.dispatch(navigateSuccess, { type, url, handler })
    } catch (e) {
      context.dispatch(navigateFailure, {
        type,
        url,
        error: Object.assign(e, { statusCode: 500 }),
      })
    }
  },
)
