import express from 'express'
import { FleurContext } from '@ragg/fleur-react'
import React from 'react'
import ReactDOM from 'react-dom/server'
import {
  navigateOp,
  RouterContext,
  createRouterContext,
} from '@ragg/fleur-route-store-dom'
import { App } from './components/App'
import { app } from './app'
import { Html } from './components/Html'
import { join } from 'path'

const server = express()
server.use('/public', express.static(join(process.cwd(), 'public')))

server.use(async (req, res) => {
  const context = ((req as any).context = app.createContext())
  const routerContext = createRouterContext()
  await context.executeOperation(navigateOp, { url: req.path })

  const content = ReactDOM.renderToString(
    <FleurContext value={context}>
      <RouterContext value={routerContext}>
        <App />
      </RouterContext>
    </FleurContext>,
  )

  const state = `window.__rehydratedState = ${JSON.stringify(
    context.dehydrate(),
  )}`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write('<!doctype html>')
  ReactDOM.renderToNodeStream(<Html children={content} state={state} />).pipe(
    res,
  )
})

console.log('Running server in :3000')
server.listen(3000)
