import { createElementWithContext } from '@ragg/fleur-react'
import { navigateOperation } from '@ragg/fleur-route-store'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as _ from 'lodash'
import { join } from 'path'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { Helmet } from 'react-helmet'

import { app } from './app'
import { App } from './components/App'
import { Html } from './components/Html'

const server = express()

const todoRepo = [...Array(100)].map((_, idx) => ({
  id: `${idx}`,
  title: 'Write Application',
  done: false,
}))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

server.use('/public', express.static(join(process.cwd(), 'public')))

server.get('/api/todos', (req, res) => {
  res.json(todoRepo)
})

server.post('/api/todos/new', (req, res) => {
  const todo = {
    id: `${Math.floor(Math.random() * 10000)}`,
    title: req.body.title,
    done: false,
  }
  todoRepo.push(todo)
  res.json(todo)
})

server.get('/favicon.ico', (req, res) => {
  res.status(404).end()
})

server.get('*', async (req, res, next) => {
  const context = app.createContext()
  const helmet = Helmet.renderStatic()

  await context.executeOperation(navigateOperation, { url: req.url })
  const state =
    'window.__dehydratedState = ' + JSON.stringify(context.dehydrate())
  const children = ReactDOMServer.renderToString(
    createElementWithContext(context, App),
  )

  res.header('Content-Type', 'text/html; charset=UTF-8')
  res.write('<!doctype html>')
  const element = React.createElement(Html, { helmet, state, children })
  ReactDOMServer.renderToNodeStream(element).pipe(res)
})

server.listen(8000)

// tslint:disable-next-line
console.log('Listening on :8000')

process.on('unhandledRejection', e => {
  // tslint:disable-next-line
  console.error(e)
})
