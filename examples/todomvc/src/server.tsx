import express from 'express'
import { createElementWithContext } from '@ragg/fleur-react'
import React from 'react'
import ReactDOM from 'react-dom/server'
import { navigateOperation } from '@ragg/fleur-route-store-dom'
import { App } from './components/App'
import { app } from './app'
import { Html } from './components/Html'
import { join } from 'path'

const server = express()
server.use('/public', express.static(join(process.cwd(), 'public')))
server.use('/node_modules', express.static(join(process.cwd(), 'node_modules')))

server.use(async (req, res) => {
  const context = ((req as any).context = app.createContext())
  await context.executeOperation(navigateOperation, { url: req.path })

  const content = ReactDOM.renderToString(
    createElementWithContext(context, App),
  )
  const state = `window.__rehydratedState = ${JSON.stringify(
    context.dehydrate(),
  )}`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write('<!doctype html>')
  ReactDOM.renderToStaticNodeStream(
    <Html children={content} state={state} />,
  ).pipe(res)
})

console.log('Running server in :3000')
server.listen(3000)
