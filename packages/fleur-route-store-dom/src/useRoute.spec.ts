import React from 'react'
import { FleurContext } from '@ragg/fleur-react'
import { renderHook } from 'react-hooks-testing-library'
import Fleur, { AppContext } from '@ragg/fleur'

import { useRoute } from './useRoute'
import {
  RouterContextValue,
  RouterContext,
  createRouterContext,
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
    routerContext: RouterContextValue,
  ) => ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      FleurContext,
      { value: context },
      React.createElement(RouterContext, { value: routerContext }, children),
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

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "error": null,
        "route": Object {
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
        },
        "routerContext": null,
      }
    `)

    history.pushState({}, '', '/not_found')
    window.dispatchEvent(new Event('popstate'))
    await new Promise(r => requestAnimationFrame(r))

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "error": [Error: URL /not_found not found in any routes],
        "route": null,
        "routerContext": null,
      }
    `)
  })
})
