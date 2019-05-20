import Fleur, { AppContext } from '@fleur/fleur'
import { navigateOp, createRouteStore } from './index'

describe('test', () => {
  const RouteStore = createRouteStore({
    articles: {
      path: '/articles',
      handler: async () => 'ArticleHandler',
      meta: {
        requireAuthorized: false,
      },
      action: () => {},
    },
    articlesShow: {
      path: '/articles/:id',
      handler: async () => 'ArticleShowHandler',
      meta: {
        requireAuthorized: true,
      },
      action: () => {},
    },
    error: {
      path: '/error',
      handler: async () => 'Error',
      action: () => {
        throw new Error('damn.')
      },
    },
  })

  const app = new Fleur({
    stores: [RouteStore],
  })

  let context: AppContext

  beforeEach(() => {
    context = app.createContext()
  })

  it('Should route to correct handler', async () => {
    await context.executeOperation(navigateOp, { url: '/articles' })

    const route = context.getStore(RouteStore).currentRoute
    expect(route.handler).toBe('ArticleHandler')
  })

  it('Should not route to partialy matched route', async () => {
    await context.executeOperation(navigateOp, {
      url: '/articles/not/match',
    })

    const route = context.getStore(RouteStore).currentRoute
    expect(route).toBe(null)
  })

  it('Should route to correct handler with ', async () => {
    await context.executeOperation(navigateOp, { url: '/articles/1' })

    const route = context.getStore(RouteStore).currentRoute
    expect(route.handler).toBe('ArticleShowHandler')
    expect(route.params.id).toBe('1')
  })

  it('Should handle exception ', async () => {
    try {
      await context.executeOperation(navigateOp, { url: '/error' })
    } catch (e) {}

    const error = context.getStore(RouteStore).currentNavigateError
    expect(error).toMatchObject({ message: 'damn.', statusCode: 500 })
  })
})
