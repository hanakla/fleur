import Fleur, { action, listen, operation, Store } from '@ragg/fleur'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createElementWithContext, useStore } from '../../fleur-react/src'

jest.setTimeout(10000)

describe('benchmark', () => {
  beforeEach(() => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(cb => setTimeout(cb))
  })

  it('Fleur / rendering time', async () => {
    const numOfDispatches = 10000
    const callCounter = jest.fn()

    const incrementAction = action()
    const incrementOperation = operation(ctx => {
      ctx.dispatch(incrementAction, {})
    })

    class TestStore extends Store<{ count: number }> {
      public static storeName = 'TestStore'

      public state = { count: 0 }

      private handleIncrement = listen(incrementAction, payload => {
        callCounter()
        this.updateWith(d => d.count++)
      })

      get count() {
        return this.state.count
      }
    }

    const Component = () => {
      const { count } = useStore([TestStore], getStore => ({
        count: getStore(TestStore).count,
      }))

      return React.createElement('div', {}, `${count}`)
    }

    const app = new Fleur({
      stores: [TestStore],
    })

    const context = app.createContext()
    context.getStore(TestStore)
    const div = document.createElement('div')

    console.time(`Fleur dispatch action ${numOfDispatches} times`)
    for (let count = 1; count < numOfDispatches + 1; count++) {
      await context.executeOperation(incrementOperation, {})
      await new Promise(r =>
        ReactDOM.render(
          createElementWithContext(context, Component, {}),
          div,
          r,
        ),
      )
      expect(div.innerHTML).toBe(`<div>${count}</div>`)
    }
    expect(callCounter.mock.calls.length).toBe(numOfDispatches)
    console.timeEnd(`Fleur dispatch action ${numOfDispatches} times`)
  })

  it('Fleur / Store update time', async () => {
    const numOfStores = 100000
    const callCounter = jest.fn()

    const incrementAction = action()
    const incrementOperation = operation(ctx => {
      ctx.dispatch(incrementAction, {})
    })

    const stores = Array.from(Array(numOfStores)).map(
      (_, idx) =>
        class TestStore extends Store<{ count: number }> {
          public static storeName = `TestStore${idx}`

          public state = { count: 0 }

          private handleIncrement = listen(incrementAction, payload => {
            callCounter()
            this.updateWith(d => d.count++)
          })

          get count() {
            return this.state.count
          }
        },
    )

    const Component = () => {
      const { values } = useStore(stores, getStore => ({
        values: stores.map(s => getStore(s).count),
      }))
      return null
    }

    const app = new Fleur({ stores })

    const context = app.createContext()
    stores.forEach(s => context.getStore(s))
    const div = document.createElement('div')

    console.time(`Fleur update ${numOfStores} stores once`)
    await context.executeOperation(incrementOperation)
    await new Promise(r =>
      ReactDOM.render(createElementWithContext(context, Component, {}), div, r),
    )
    expect(callCounter.mock.calls.length).toBe(numOfStores)
    console.timeEnd(`Fleur update ${numOfStores} stores once`)
  })
})
