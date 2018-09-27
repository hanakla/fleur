import * as express from 'express'
import * as bodyParser from 'body-parser'
import { navigateOperation } from '@ragg/fleur-route-store'
import { createElementWithContext } from '@ragg/fleur-react'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as _ from 'lodash'
import { join } from 'path';
import { Helmet } from 'react-helmet';

import { app } from './app'
import { Html } from './components/Html'
import { App } from './components/App'

const server = express();

const todoRepo = [
  { id: 1, title: 'Write Application', done: false },
  { id: 2, title: 'Write Test', done: false },
];

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

server.use('/public', express.static(join(process.cwd(), 'public')));

server.get('/api/todos', (req, res) => {
  res.json(todoRepo)
});

server.post('/api/todos/new', (req, res) => {
  const todo = { id: Math.floor(Math.random() * 10000), title: req.body.title, done: false }
  todoRepo.push(todo)
  res.json(todo)
});

server.get('/favicon.ico', (req, res) => {
  res.status(404).end()
})

server.get('*', async (req, res, next) => {
  const context = app.createContext();
  const helmet = Helmet.renderStatic()

  await context.executeOperation(navigateOperation, { url: req.url })
  const state = 'window.__dehydratedState = ' + JSON.stringify(context.dehydrate())
  const children = ReactDOMServer.renderToString(createElementWithContext(context, App))

  res.write('<!doctype html>')
  const element = React.createElement(Html, { helmet, state, children })
  ReactDOMServer.renderToNodeStream(element).pipe(res)
});

server.listen(8000)
console.log('Listening on :8000')
