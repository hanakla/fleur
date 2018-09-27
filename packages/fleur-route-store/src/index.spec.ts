import Fleur from '@ragg/fleur'
import { navigateOperation, withStaticRoutes } from './index'

describe('test', () => {
    const RouteStore = withStaticRoutes({
        articles: {
            path: '/articles',
            handler: 'ArticleHandler',
            meta: {
                requireAuthorized: false,
            },
            action: () => { }
        },
        articlesShow: {
            path: '/articles/:id',
            handler: 'ArticleShowHandler',
            meta: {
                requireAuthorized: true,
            },
            action: () => { }
        },
        error: {
            path: '/error',
            handler: 'Error',
            action: () => { throw new Error('damn.') }
        }
    })

    const app = new Fleur({
        stores: [
            RouteStore
        ]
    })

    const context = app.createContext()

    it('Should route to correct handler', async () => {
        await context.executeOperation(navigateOperation, { url: '/articles' })

        const route = context.getStore(RouteStore).getCurrentRoute()
        expect(route.config.handler).toBe('ArticleHandler')
    })

    it('Should route to correct handler with ', async () => {
        await context.executeOperation(navigateOperation, { url: '/articles/1' })

        const route = context.getStore(RouteStore).getCurrentRoute()
        expect(route.config.handler).toBe('ArticleShowHandler')
        expect(route.params.id).toBe('1')
    })

    it('Should handle exception ', async () => {
        await context.executeOperation(navigateOperation, { url: '/error' })

        const error = context.getStore(RouteStore).getCurrentNavigateError()
        expect(error).toMatchObject({ message: 'damn.', statusCode: 500 })
    })
})
