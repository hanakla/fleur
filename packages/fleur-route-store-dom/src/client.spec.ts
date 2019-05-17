import Fleur, { AppContext } from '@ragg/fleur'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { FleurContext } from '@ragg/fleur-react'
import { createRouteStore, RouterContext, createRouterContext } from './index'

describe('client test', () => {
  const Router = createRouteStore({
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
      action: () => new Promise(r => setTimeout(r)),
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
    expect(route.handler).toBe('ArticleHandler')

    history.pushState({}, '', '/articles/1')
    window.dispatchEvent(new Event('popstate'))
    await new Promise(r => setTimeout(r, 100))

    const nextRoute = context.getStore(Router).getCurrentRoute()
    expect(nextRoute.handler).toBe('ArticleShowHandler')
  })

  it('Should route to 404', async () => {
    history.pushState({}, '', '/not_found')
    window.dispatchEvent(new Event('popstate'))
    await new Promise(r => setTimeout(r, 100))

    const route = context.getStore(Router).getCurrentRoute()
    expect(route).toBe(null)
  })
})
