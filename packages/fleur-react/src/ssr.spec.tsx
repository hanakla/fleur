import Fleur, { action, listen, operation, Store } from '@ragg/fleur'
import * as cheerio from 'cheerio'
import * as express from 'express'
import { Server } from 'http'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as request from 'request-promise'

import { useStore } from './useStore'
import { FleurContext } from './ComponentContextProvider'

describe('Sever side rendering', () => {
  let server: Server
  let app: Fleur

  beforeAll(() => {
    const increaseIdent = action<{ increase: number }>()

    const increaseOp = operation((ctx, { increase }: { increase: number }) => {
      ctx.dispatch(increaseIdent, { increase })
    })

    class TestStore extends Store {
      public static storeName = 'TestStore'
      protected state = { count: 0 }
      private increase = listen(increaseIdent, ({ increase }) => {
        this.updateWith(d => (d.count += increase))
      })
      public getCount() {
        return this.state.count
      }
    }

    // const Component = connectToStores([TestStore], getStore => ({
    //   count: getStore(TestStore).getCount(),
    // }))((props: { count: number }) => <div>{`Your count ${props.count}`}</div>)

    const Component = () => {
      const { count } = useStore([TestStore], getStore => ({
        count: getStore(TestStore).getCount(),
      }))

      return <div>{`Your count ${count}`}</div>
    }

    app = new Fleur({ stores: [TestStore] })

    const serverApp = express()
    serverApp.get('/', async (req, res) => {
      try {
        const context = app.createContext()

        await context.executeOperation(increaseOp, {
          increase: parseInt(req.query.amount, 10),
        })

        res.write(
          ReactDOMServer.renderToString(
            <html>
              <head>
                <script data-state={JSON.stringify(context.dehydrate())} />
              </head>
              <body>
                <FleurContext value={context}>
                  <Component />
                </FleurContext>
              </body>
            </html>,
          ),
        )

        res.end()
      } catch (e) {
        server && server.close()
        throw e
      }
    })
    server = serverApp.listen(31987)
  })

  afterAll(() => {
    server && server.close()
  })

  it('test', async () => {
    try {
      // First request
      const res1 = await request.get('http://localhost:31987/?amount=10')
      const dehydratedState1 = JSON.parse(
        cheerio
          .load(res1)('script')
          .attr('data-state'),
      )

      expect(res1).toContain('<div>Your count 10</div>')
      expect(dehydratedState1).toEqual({ stores: { TestStore: { count: 10 } } })
      const clientContext1 = app.createContext()
      clientContext1.rehydrate(dehydratedState1)
      expect(clientContext1.getStore('TestStore').state).toEqual({ count: 10 })

      // Another request
      const res2 = await request.get('http://localhost:31987/?amount=20')
      const dehydratedState2 = JSON.parse(
        cheerio
          .load(res2)('script')
          .attr('data-state'),
      )

      expect(res2).toContain('<div>Your count 20</div>')
      expect(dehydratedState2).toEqual({ stores: { TestStore: { count: 20 } } })
      const clientContext2 = app.createContext()
      clientContext2.rehydrate(dehydratedState2)
      expect(clientContext2.getStore('TestStore').state).toEqual({ count: 20 })
    } catch (e) {
      throw e
    }
  })
})
