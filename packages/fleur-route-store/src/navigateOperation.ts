import { operation, OperationContext } from '@ragg/fleur'
import { navigateFailure, navigateStart, navigateSuccess } from './actions'
import RouteStore from './RouteStore';

export const navigateOperation = operation(async (context: OperationContext<any>, { url }: { url: string }) => {
    const routeStore = context.getStore(RouteStore)

    context.dispatch(navigateStart, { url })

    const route = routeStore.getCurrentRoute()

    if (!route) {
        context.dispatch(navigateFailure, {
            url,
            error: Object.assign(new Error(`URL ${url} not found in any routes`), { statusCode: 404 })
        })

        return
    }

    try {
        if (route.config.action) {
            await Promise.resolve(route.config.action(context, route))
        }

        context.dispatch(navigateSuccess, { url })
    } catch (e) {
        context.dispatch(navigateFailure, { url, error: Object.assign(e, { statusCode: 500 }) })
    }
})
