import React from 'react'
import { FleurContext } from '@ragg/fleur-react'
import { renderHook } from 'react-hooks-testing-library'
import Fleur, { AppContext } from '@ragg/fleur'

import { useRoute } from './useRoute'
import {
  RouterContext,
  createRouterContext,
  RouterProvider,
} from './RouterContext'
import { createRouteStore } from './createRouteStore'

describe('useRoute', () => {
  const Router = createRouteStore({
    test: {
      path: '/test/:id',
      handler: async () => 'test',
    },
  })

  const app = new Fleur({
    stores: [Router],
  })

  const wrapperFactory = (
    context: AppContext,
    routerContext: RouterContext,
  ) => ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      FleurContext,
      { value: context },
      React.createElement(RouterProvider, { value: routerContext }, children),
    )
  }

  it.only('Should correctry worked', async () => {
    const appContext = app.createContext()
    const routeContext = createRouterContext()

    const { result, rerender } = renderHook(() => useRoute(), {
      wrapper: wrapperFactory(appContext, routeContext),
    })

    history.pushState({}, '', '/test/10?sort=asc#anchor')
    window.dispatchEvent(new Event('popstate'))
    await new Promise(r => requestAnimationFrame(r))
    rerender()

    expect(result.current.error).toBe(null)
    expect(result.current.route).toMatchInlineSnapshot(`
      Object {
        "config": Object {
          "handler": [Function],
          "path": "/test/:id",
        },
        "handler": "test",
        "meta": Object {},
        "name": "test",
        "params": Object {
          "id": "10",
        },
        "query": Object {
          "sort": "asc",
        },
        "type": "POP",
        "url": "/test/10?sort=asc",
      }
    `)

    history.pushState({}, '', '/not_found')
    window.dispatchEvent(new Event('popstate'))
    await new Promise(r => requestAnimationFrame(r))

    expect(result.current.route).toBe(null)
    console.log(result.current.error)
    expect(result.current.error).toMatchObject({
      message: 'URL /not_found not found in any routes',
      statusCode: 404,
    })
  })
})
