# fleur-route-store-dom [![npm version](https://badge.fury.io/js/%40ragg%2Ffleur-route-store-dom.svg)](https://www.npmjs.com/package/@ragg/fleur-route-store-dom) [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur)

fluxible-route inspired router for [fleur](https://www.npmjs.com/package/@ragg/fleur)

## Usage

```tsx
// Router.ts
import * as loadable from 'react-loadable'
import { withStaticRoutes, MatchedRoute } from '@ragg/fleur-route-store-dom'
import { fetchUser } from './operations'

export const Router = createRouteStore({
  articleShow: {
    path: '/article/:id',
    action: (context, route: MatchedRoute) =>
      Promise.all([
        context.executeOperation(fetchUser, { id: route.param.id }),
      ]),
    handler: () => import('./routes/User'),
    meta: {
      noHeader: true,
    },
  },
})

// routes/User.ts
import { Link } from '@ragg/fluer-route-store-dom'
import { NotFound } from './components/NotFound.ts'

export const User = () => {
  const { routerContext } = useRoute()

  const { user } = useStore([SomeStore], getStore => ({
    user: getStore(SomeStore).data,
  }))

  // Handling API side not found in render time
  if (!user) {
    routerContext.status = 404
    return <NotFound />
  }

  return (
    <div>
      {/* Link component and URL builder */}
      <Link href={Router.makePath('articleShow', { id: 100 })}>
        {user.name}
      </Link>
    </div>
  )
}

// App.ts
import { useRoute } from '@ragg/fleur-route-store-dom'
import { Router } from './Router.ts'

export const App = () => {
  const { route, error, routerContext } = useRoute()

  return (
    <html>
      <head>{/* heading... */}</head>
      <body>
        <div>
          {/* Handle not found*/}
          {!route && <div>Not Found</div>}

          {error && <div>500 Error</div>}

          {/* get .meta property from route.meta */}
          {route && !route.meta.noHeader && <header />}

          {/* mount Handler component here */}
          {route && route.handler && <route.Handler />}
        </div>
      </body>
    </html>
  )
}

// server.ts
import Fleur from '@ragg/fleur'
import { navigateOp, createRouterContext } from '@ragg/fleur-route-store-dom'
import express from 'express'
import RouteStore from './RouteStore'
import App from './App'
import { fetchUserSession } from './fetchUserSetssion'

const server = express()
const app = new Fleur({ stores: [RouteStore] })

server.use((req, res) => {
  const context = (req.context = app.createContext())
  const routerContext = createRouterContext()

  context.executeOperation(fetchUserSession)

  context.executeOperation(navigateOp, {
    url: req.url,
    method: req.method,
  })

  res.write('<!doctype html>')
  res.write(content)
  ReactDOMServer.renderToNodeStream(
    <FleurContext value={context}>
      <RouterContext value={routerContext}>
        <App />
      </RouterContext>
    </FleurContext>,
  )

  res.status = routerContext.status
})
```
