# DEPRECATED: Currently, not checked to works correctly
# Please waiting newer Router release...

# @fleur/route-store-dom [![npm version](https://badge.fury.io/js/%40fleur%2Froute-store-dom.svg)](https://www.npmjs.com/package/@fleur/fleur-route-store-dom) [![travis](https://travis-ci.org/fleur-js/fleur.svg?branch=master)](https://travis-ci.org/fleur-js/fleur) ![minifiedgzip](https://badgen.net/bundlephobia/minzip/@fleur/route-store-dom)

fluxible-router inspired router for [fleur](https://www.npmjs.com/package/@fleur/fleur)

## Features

- API prefetching supported
- Completely able to using in Server Side Rendering
- Lazy loading supported without extra code transformer
- URL builder

## Usage overview

See more detail in [todomvc example](https://github.com/fleur-js/fleur/tree/master/packages/example-todomvc)

```tsx
//
// Router.ts
//
import { createRouteStore } from '@fleur/route-store-dom'

export const Router = createRouteStore({
  userShow: {
    path: '/user/:id',
    action: ({ executeOperation }, route) =>
      Promise.all([executeOperation(fetchUser, { id: route.param.id })]),
    handler: () => import('./routes/User'),
    meta: {
      noHeader: true,
    },
  },
})

//
// routes/UserShow.tsx
//
import { Link } from '@fleur/route-store-dom'
import { Router } from '../Router.ts'

// if you want to use route in class component,
// see packages/example-todomvc/src/routes/Index.tsx
export const UserShow = () => {
  const { routerContext, params } = useRoute()

  const { user } = useStore(getStore => ({
    user: getStore(UserStore).getUser(params.id),
  }))

  // Handling API side not found in render time
  if (!user) {
    routerContext.status = 404
    return <NotFound />
  }

  return (
    <div>
      {/* Link component and URL builder */}
      <Link href={Router.makePath('userShow', { id: params.id })}>
        {user.name}
      </Link>
    </div>
  )
}

//
// components/AppRoot.tsx
//
export const AppRoot = () => {
  const { route, error, routerContext } = useRoute()

  return (
    <div>
      {/* Handle not found*/}
      {!route && <div>Not Found</div>}

      {error && <div>500 Error</div>}

      {/* get .meta property from route.meta */}
      {route && !route.meta.noHeader && <header />}

      {/* mount Handler component here */}
      {route && route.handler && <route.Handler />}
    </div>
  )
}

//
// server.tsx
//
import Fleur from '@fleur/fleur'
import { navigateOp, createRouterContext } from '@fleur/route-store-dom'
import serialize from 'serialize-javascript';
import express from 'express'
import { Router } from './Router'
import { AppRoot } from './components/AppRoot'

const server = express()
const app = new Fleur({ stores: [RouteStore] })

server.use(async (req, res) => {
  const context = app.createContext()
  const routerContext = createRouterContext()

  // Route to handler.
  // It's executes API fetch and lazy component loading
  await context.executeOperation(navigateOp, {
    url: req.url,
  })

  const content = ReactDOMServer.renderToString(
    <FleurContext value={context}>
      <RouterContext value={routerContext}>
        <AppRoot />
      </RouterContext>
    </FleurContext>,
  )

  const rehydrated = serialize(context.dehydrate())

  res.status(routerContext.status)
  res
    .write('<!doctype html>')
    .write(<Html state={rehydrated} content={content} />)
    .end()
})

//
// client.tsx
//
import { AppRoot } from './components/AppRoot'
import { FleurContext } from '@fleur/react'
import { RouterProvider, restoreNavigateOp } from '@fleur/route-store-dom'

document.addEventListener('DOMContentLoaded', async () => {
  const state = window.__dehydrated
  const context = app.createContext()

  context.rehydrate(state)

  // **IMPORTANT** It's required before rendering for fetching import()ed components!
  await context.executeOperation(restoreNavigateOp)

  ReactDOM.hydrate(
    <FleurContext value={context}>
      <RouterProvider>
        <App />
      </RouterProvider>
    </FleurContext>,
    document.querySelector('#react-root'),
  )
})
```
