import React from 'react'
import { FleurContext } from '@fleur/fleur-react'
import { renderHook, act } from '@testing-library/react-hooks'
import Fleur, { AppContext } from '@fleur/fleur'

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

    const { result } = renderHook(() => useRoute(), {
      wrapper: wrapperFactory(appContext, routeContext),
    })

    await act(async () => {
      history.pushState({}, '', '/test/10?sort=asc#anchor')
      window.dispatchEvent(new Event('popstate'))
      await new Promise(r => requestAnimationFrame(r))
    })

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
    expect(result.current.routerContext).toMatchInlineSnapshot(`
      Object {
        "status": 200,
      }
    `)

    await act(async () => {
      history.pushState({}, '', '/not_found')
      window.dispatchEvent(new Event('popstate'))
      await new Promise(r => requestAnimationFrame(r))
    })

    expect(result.current.route).toBe(null)
    expect(result.current.error).toMatchObject({
      message: 'URL /not_found not found in any routes',
      statusCode: 404,
    })
    expect(result.current.routerContext).toMatchInlineSnapshot(`
      Object {
        "status": 200,
      }
    `)
  })
})
