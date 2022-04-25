import { operation } from '@fleur/fleur'
import { Action } from 'history'
import invariant from 'invariant'
import { NavigationActions } from './actions'
import { RouteStore } from './RouteStore'
import deepEqual from 'fast-deep-equal'
import { canUseDOM } from './utils'

export const restoreNavigateOp = operation(async (context) => {
  invariant(canUseDOM(), 'restoreNavigateOp only use in client side')

  const routeStore = context.getStore(RouteStore)
  const url = location.pathname + location.search + location.hash
  const route = routeStore.getRoute(url)

  context.dispatch(NavigationActions.navigateStart, { url })

  if (!route) {
    context.dispatch(NavigationActions.navigateFailure, {
      url,
      error: Object.assign(new Error(`URL ${url} not found in any routes`), {
        statusCode: 404,
      }),
    })

    return
  }

  const handler = await (route.config.handler
    ? Promise.resolve(route.config.handler()).then((mod) => {
        return mod.default ? mod.default : mod
      })
    : Promise.resolve())

  context.dispatch(NavigationActions.navigateSuccess, { url, handler })
})

export const navigateOp = operation(
  async (
    context,
    {
      url,
      type = 'PUSH',
    }: {
      url: string
      type?: Action
    },
  ) => {
    context.dispatch(NavigationActions.navigateStart, { url, type })

    const routeStore = context.getStore(RouteStore)
    const { currentRoute } = routeStore
    const nextRoute = routeStore.getRoute(url)

    if (!nextRoute) {
      context.dispatch(NavigationActions.navigateFailure, {
        type,
        url,
        error: Object.assign(new Error(`URL ${url} not found in any routes`), {
          statusCode: 404,
        }),
      })

      return
    }

    if (currentRoute) {
      // Prevent execute route actions if same route

      const isEqualRoute = deepEqual(
        {
          name: currentRoute.name,
          params: currentRoute.params,
          query: currentRoute.query,
        },
        {
          name: nextRoute.name,
          params: nextRoute.params,
          query: nextRoute.query,
        },
      )

      if (isEqualRoute) return
    }

    try {
      const [, handler] = await Promise.all([
        nextRoute.config.action
          ? Promise.resolve(nextRoute.config.action(context, nextRoute))
          : Promise.resolve(),
        nextRoute.config.handler
          ? Promise.resolve(nextRoute.config.handler()).then((mod) =>
              mod.default ? mod.default : mod,
            )
          : Promise.resolve(),
      ])

      context.dispatch(NavigationActions.navigateSuccess, {
        type,
        url,
        handler,
      })
    } catch (e) {
      context.dispatch(NavigationActions.navigateFailure, {
        type,
        url,
        error: Object.assign(e, { statusCode: 500 }),
      })

      // Rethrow for debugging and error logging
      throw e
    }
  },
)
