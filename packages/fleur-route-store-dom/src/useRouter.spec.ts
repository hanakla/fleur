import React from 'react'
import { FleurContext } from '@ragg/fleur-react'
import { renderHook, act } from 'react-hooks-testing-library'
import Fleur, { AppContext } from '@ragg/fleur'

import { useRouter } from './useRouter'
import {
  RouterContextValue,
  RouterContext,
  createRouterContext,
} from './RouterContext'
import { createRouteStore } from './createRouteStore'

describe('useRouter', () => {
  const Router = createRouteStore({
    test: {
      path: '/test',
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

  it('Should correctry worked', async () => {
    const appContext = app.createContext()
    const routeContext = createRouterContext()

    const { result, rerender } = renderHook(() => useRouter(), {
      wrapper: wrapperFactory(appContext, routeContext),
    })

    history.pushState({}, '', '/test')
    window.dispatchEvent(new Event('popstate'))
    jest.runAllTicks()
    await new Promise(r => requestAnimationFrame(r))

    expect(result.current).toMatchInlineSnapshot(`
                Object {
                  "error": null,
                  "route": Object {
                    "config": Object {
                      "handler": [Function],
                      "path": "/test",
                    },
                    "handler": "test",
                    "meta": Object {},
                    "name": "test",
                    "params": Object {},
                    "query": Object {},
                    "type": "POP",
                    "url": "/test",
                  },
                  "routerContext": null,
                }
        `)

    history.pushState({}, '', '/not_found')
    window.dispatchEvent(new Event('popstate'))
    jest.runAllTicks()
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
