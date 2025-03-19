import * as Fluxible from 'fluxible'
import {
  connectToStores,
  createElementWithContext,
} from 'fluxible-addons-react'
import * as BaseStore from 'fluxible/addons/BaseStore'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

jest.setTimeout(10000)

describe('benchmark', () => {
  it('Fluxible / dispatch time', async () => {
    const numOfDispatches = 10000
    const callCounter = jest.fn()

    const incrementOperation = (ctx) => {
      ctx.dispatch('INCREMENT', {})
    }

    class TestStore extends (BaseStore as any) {
      public static storeName = 'TestStore'
      public static handlers = {
        INCREMENT: 'handleIncrement',
      }

      public state = { count: 0 }
      private handleIncrement(payload) {
        callCounter()
        this.state = { count: this.state.count + 1 }
        this.emitChange()
      }

      get count() {
        return this.state.count
      }
    }

    const Component = connectToStores([TestStore], (ctx) => ({
      count: ctx.getStore(TestStore).count,
    }))(
      class extends React.Component<{ count: number }> {
        public render() {
          return React.createElement('div', {}, `${this.props.count}`)
        }
      },
    )

    const app = new Fluxible({
      component: Component,
      stores: [TestStore],
    })

    const context = app.createContext()
    context.getStore(TestStore)
    const div = document.createElement('div')
    await new Promise((r) =>
      ReactDOM.render(createElementWithContext(context, {}), div, r),
    )

    console.time(`Fluxible dispatch action ${numOfDispatches} times`)
    for (let count = 1; count < numOfDispatches + 1; count++) {
      await context.executeAction(incrementOperation, {})
    }
    await new Promise((r) => requestAnimationFrame(r))

    expect(div.innerHTML).toBe(`<div>${numOfDispatches}</div>`)
    expect(callCounter.mock.calls.length).toBe(numOfDispatches)
    console.timeEnd(`Fluxible dispatch action ${numOfDispatches} times`)
  })

  it('Fluxible / Store update time', async () => {
    const numOfStores = 1000
    const callCounter = jest.fn()

    const incrementOperation = (ctx) => {
      ctx.dispatch('INCREMENT', {})
    }
    const stores = Array.from(Array(numOfStores)).map(
      (_, idx) =>
        class TestStore extends (BaseStore as any) {
          public static storeName = `TestStore${idx}`
          public static handlers = {
            INCREMENT: 'handleIncrement',
          }

          public state = { count: 0 }
          private handleIncrement(payload) {
            callCounter()
            this.state = { count: this.state.count + 1 }
            this.emitChange()
          }

          get count() {
            return this.state.count
          }
        },
    )

    const Component = connectToStores(stores, (ctx) => ({
      sum: stores.reduce((accum, s) => accum + ctx.getStore(s).count, 0),
    }))(({ sum }: any) => `${sum}`)

    const app = new Fluxible({
      component: Component,
      stores: stores,
    })
    const context = app.createContext()
    stores.forEach((s) => context.getStore(s))
    const div = document.createElement('div')
    await new Promise((r) =>
      ReactDOM.render(createElementWithContext(context, {}), div, r),
    )

    console.time(`Fluxible update ${numOfStores} stores once`)
    await context.executeAction(incrementOperation, {})
    await new Promise((r) => requestAnimationFrame(r))

    expect(div.innerHTML).toBe(`${numOfStores}`)
    expect(callCounter.mock.calls.length).toBe(numOfStores)
    console.timeEnd(`Fluxible update ${numOfStores} stores once`)
  })
})
