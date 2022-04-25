import React from 'react'
import { create } from 'react-test-renderer'
import Fleur, { AppContext } from '@fleur/fleur'
import { FleurContext } from '@fleur/react'
import { createRouteStore } from './createRouteStore'
import { RouterProvider } from './RouterContext'
import { navigateOp } from './operations'
import { RouteProps, withRoute } from './withRoute'
import { createRouterContext } from './RouterContext'

describe('withRoute', () => {
  const Router = createRouteStore({
    test: {
      path: '/test/:id',
      handler: async () => 'test',
    },
  })

  const app = new Fleur({
    stores: [Router],
  })

  const createElement = (context: AppContext, children: React.ReactNode) => (
    <FleurContext value={context}>
      <RouterProvider value={createRouterContext()}>{children}</RouterProvider>
    </FleurContext>
  )

  it('Should receive route props', async () => {
    const context = app.createContext()
    const Receiver = (props: RouteProps & { a: string }) => null
    const Wrapped = withRoute(Receiver)

    await context.executeOperation(navigateOp, { url: '/test/1' })
    await new Promise((r) => requestAnimationFrame(r))

    const { root, unmount } = create(createElement(context, <Wrapped a="1" />))

    expect(root.findByType(Receiver).props).toMatchInlineSnapshot(`
      Object {
        "a": "1",
        "route": Object {
          "config": Object {
            "handler": [Function],
            "path": "/test/:id",
          },
          "handler": "test",
          "meta": Object {},
          "name": "test",
          "params": Object {
            "id": "1",
          },
          "query": Object {},
          "type": "PUSH",
          "url": "/test/1",
        },
        "routeError": null,
        "routerContext": Object {
          "status": 200,
        },
      }
    `)

    unmount()
  })
})
