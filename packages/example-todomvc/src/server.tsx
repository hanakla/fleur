import express from 'express'
import { FleurContext } from '@fleur/fleur-react'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {
  navigateOp,
  RouterProvider,
  createRouterContext,
} from '@fleur/route-store-dom'
import { App } from './components/App'
import { app } from './app'
import { Html } from './components/Html'
import { join } from 'path'
import { TodoEntity } from './domain/Todo/types'
import RouteStore from './domain/RouteStore'

const server = express()
server.use('/public', express.static(join(process.cwd(), 'public')))
server.use('/dist', express.static(join(process.cwd(), 'dist')))

server.get('/favicon.ico', (req, res) => {
  res.status(404)
  res.end()
})

server.get('/api/todos', (req, res) => {
  const result: TodoEntity[] = [
    { id: '1', completed: true, title: 'Create an issue' },
    { id: '2', completed: false, title: 'Create implementation' },
    { id: '3', completed: false, title: 'Create PR' },
    { id: '4', completed: false, title: 'Review' },
    { id: '5', completed: false, title: 'Deploy' },
  ]

  res.json(result).end()
})

server.use(async (req, res) => {
  const context = ((req as any).context = app.createContext())
  const routerContext = createRouterContext()
  await context.executeOperation(navigateOp, { url: req.path })

  if (context.getStore(RouteStore).currentRoute == null) {
    res.status(404).end()
    return
  }

  const content = ReactDOMServer.renderToString(
    <FleurContext value={context}>
      <RouterProvider value={routerContext}>
        <App />
      </RouterProvider>
    </FleurContext>,
  )

  const state = `window.__rehydratedState = ${JSON.stringify(
    context.dehydrate(),
  )}`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write('<!doctype html>')
  ReactDOMServer.renderToNodeStream(
    <Html children={content} state={state} />,
  ).pipe(res)
})

console.log('Running server in :3000')
server.listen(3000)
