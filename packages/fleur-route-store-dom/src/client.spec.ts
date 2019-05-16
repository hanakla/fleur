import Fleur, { AppContext } from '@ragg/fleur'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { FleurContext } from '@ragg/fleur-react'
import { createRouteStore, RouterContext, createRouterContext } from './index'

describe('client test', () => {
  const Router = createRouteStore({
    articles: {
      path: '/articles',
      handler: 'ArticleHandler',
      meta: {
        requireAuthorized: false,
      },
      action: () => {},
    },
    articlesShow: {
      path: '/articles/:id',
      handler: 'ArticleShowHandler',
      meta: {
        requireAuthorized: true,
      },
      action: () => new Promise(r => setTimeout(r, 1000)),
    },
  })

  const app = new Fleur({
    stores: [Router],
  })
  let context: AppContext
  let routerContext: RouterContext

  const div = document.createElement('div')

  beforeEach(() => {
    context = app.createContext()
    routerContext = createRouterContext()
    history.pushState({}, '', '/')

    ReactDOM.render(
      React.createElement(
        FleurContext,
        { value: context },
        React.createElement(RouterContext, {}, 'route'),
      ),
      div,
    )
  })

  it('Should route to correct handler', async () => {
    history.pushState({}, '', '/articles')
    window.dispatchEvent(new Event('popstate'))
    await new Promise(r => setTimeout(r, 100))

    const route = context.getStore(Router).getCurrentRoute()
    expect(route.config.handler).toBe('ArticleHandler')

    history.pushState({}, '', '/articles/1')
    window.dispatchEvent(new Event('popstate'))
    await new Promise(r => setTimeout(r, 100))

    const nextRoute = context.getStore(Router).getCurrentRoute()
    expect(nextRoute.config.handler).toBe('ArticleShowHandler')
  })

  // it('Should handle routing', () => {})

  // it('Should not route to partialy matched route', async () => {
  //   await context.executeOperation(navigateOperation, {
  //     url: '/articles/not/match',
  //   })

  //   const route = context.getStore(RouteStore).getCurrentRoute()
  //   expect(route).toBe(null)
  // })

  // it('Should route to correct handler with ', async () => {
  //   await context.executeOperation(navigateOperation, { url: '/articles/1' })

  //   const route = context.getStore(RouteStore).getCurrentRoute()
  //   expect(route.config.handler).toBe('ArticleShowHandler')
  //   expect(route.params.id).toBe('1')
  // })

  // it('Should handle exception ', async () => {
  //   await context.executeOperation(navigateOperation, { url: '/error' })

  //   const error = context.getStore(RouteStore).getCurrentNavigateError()
  //   expect(error).toMatchObject({ message: 'damn.', statusCode: 500 })
  // })
})
