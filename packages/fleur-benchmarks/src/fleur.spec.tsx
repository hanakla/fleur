import Fleur, { action, operation, reducerStore } from '@fleur/fleur'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useStore, FleurContext } from '@fleur/react'

jest.setTimeout(10000)

describe('benchmark', () => {
  it('Fleur / rendering time', async () => {
    const numOfDispatches = 10000
    const callCounter = jest.fn()
    const renderCounter = jest.fn()
    const selectCounter = jest.fn()

    const incrementAction = action()
    const incrementOperation = operation(ctx => {
      ctx.dispatch(incrementAction, {})
    })

    const TestStore = reducerStore('TestStore', () => ({ count: 0 })).listen(
      incrementAction,
      draft => {
        callCounter()
        draft.count++
      },
    )

    const Component = () => {
      const count = useStore(getStore => {
        selectCounter()
        return getStore(TestStore).state.count
      })

      renderCounter()

      return <div>{count}</div>
    }

    const app = new Fleur({
      stores: [TestStore],
    })

    const context = app.createContext()
    context.getStore(TestStore)
    const div = document.createElement('div')

    await new Promise<void>(r => {
      ReactDOM.render(
        <FleurContext value={context}>
          <Component />
        </FleurContext>,
        div,
        r,
      )
    })

    console.time(`[fleur] dispatch ${numOfDispatches} actions`)
    for (let count = 1; count < numOfDispatches + 1; count++) {
      await context.executeOperation(incrementOperation)
    }
    await new Promise(r => requestAnimationFrame(r))

    expect(div.innerHTML).toBe(`<div>${numOfDispatches}</div>`)
    expect(callCounter.mock.calls.length).toBe(numOfDispatches)
    console.timeEnd(`[fleur] dispatch ${numOfDispatches} actions`)
    console.log(
      `[fleur] dispatch ${numOfDispatches} actions: select state ${selectCounter.mock.calls.length} times`,
    )
    console.log(
      `[fleur] dispatch ${numOfDispatches} actions: re-renders Component ${renderCounter.mock.calls.length} times`,
    )
  })

  it('Fleur / Store update time', async () => {
    const numOfStores = 1000
    const storeCallCounter = jest.fn()
    const renderCounter = jest.fn()
    const selectCounter = jest.fn()

    const incrementAction = action()
    const incrementOperation = operation(ctx => {
      ctx.dispatch(incrementAction, {})
    })

    const stores = Array.from(Array(numOfStores)).map((_, idx) => {
      return reducerStore(`TestStore${idx}`, () => ({ count: 0 })).listen(
        incrementAction,
        draft => {
          storeCallCounter()
          draft.count++
        },
      )
    })

    const Component = () => {
      const sum = useStore(getStore => {
        selectCounter()
        return stores.reduce((accum, s) => accum + getStore(s).state.count, 0)
      })

      renderCounter()

      return <>{sum}</>
    }

    const app = new Fleur({ stores })
    const context = app.createContext()

    const div = document.createElement('div')
    await new Promise<void>(r =>
      ReactDOM.render(
        <FleurContext value={context}>
          <Component />
        </FleurContext>,
        div,
        r,
      ),
    )

    console.time(`[fleur] Update ${numOfStores} stores once`)
    await context.executeOperation(incrementOperation)
    await new Promise(r => requestAnimationFrame(r))

    expect(div.innerHTML).toBe(`${numOfStores}`)
    expect(storeCallCounter.mock.calls.length).toBe(numOfStores)
    console.timeEnd(`[fleur] Update ${numOfStores} stores once`)
    console.log(
      `[fleur] Update ${numOfStores} stores once: select state ${selectCounter.mock.calls.length} times`,
    )
    console.log(
      `[fleur] Update ${numOfStores} stores once: re-renders Component ${renderCounter.mock.calls.length} times`,
    )
  })
})
