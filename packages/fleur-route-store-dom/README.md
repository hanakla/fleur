# fleur-route-store-dom [![npm version](https://badge.fury.io/js/%40ragg%2Ffleur-route-store-dom.svg)](https://www.npmjs.com/package/@ragg/fleur-route-store-dom) [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur)

fluxible-route inspired router for [fleur](https://www.npmjs.com/package/@ragg/fleur)

## Usage

```tsx
// RouteStore.ts
import * as Loadable from 'react-loadable'
import { withStaticRoutes, Route } from '@ragg/fleur-route-store-dom'
import { fetchUserSession, fetchArticle } from './operations'

export const Router = createRouteStore({
    articleShow: {
        path: '/article/:id',
        action: (context, route: Route) => Promise.all([
            context.executeOperation(fetchUserSession, {}),
            context.executeOperation(fetchArticle, { id: route.param.id })
        ])
        handler: Loadable({ loader: () => import('./ArticleContainer') }),
        meta: {
            noHeader: true,
        },
    }
})

// App.ts
import { connectToStores, withComponentContext, ContextProp } from '@ragg/fleur-react'
import { useRoute } from '@ragg/fleur-route-store-dom'
import { }

type Props = {
    route: Route | null
} & ContextProp

export const App = () => {
  const {route, error} = useRoute()

  return (
    <html>
      <head>
        {/* heading... */}
      </head>
      <body>
        <div>
          {/* get .meta property from route.meta */}
          {!route.meta.noHeader && <header />}

          {/* mount Handler component here */}
          {route.handler && <route.Handler />}
          {!route.handler && (<div>Not Found</div>)}
          {error && (<div>500 Error</div>)}

          {/* URL Builder */}
          <a href={Router.makePath('articleShow', { id: 100 })}>
            Jump to Article
          </a>
        </div>
      </body>
    </html>
  )
}

// server.ts
import Fleur from '@ragg/fleur'
import { navigateOperation, createRouterContext } from '@ragg/fleur-route-store-dom'
import express from 'express'
import RouteStore from './RouteStore'
import App from './App'

const server = express()
const app = new Fleur({ stores: [ RouteStore ] })

server.use((req, res) => {
    const context = req.context = app.createContext();
    const routerContext = createRouterContext()

    context.executeOperation(navigateOperation, {
        url: req.url,
        method: req.method
    })

    const content = ReactDOM.renderToString(
        <FleurContext value={context}>
            <RouterContext value={routerContext}>
                <App />
            </RouterContext>
        </FleurContext>
    )

    res.status = routerContext.status
    context

    res.write('<!doctype html>')
    res.write(content)
})

```
