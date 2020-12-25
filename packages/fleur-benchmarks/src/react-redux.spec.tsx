import { createStore, combineReducers } from 'redux'
import {
  connect,
  Provider,
  batch,
  useSelector,
  shallowEqual,
} from 'react-redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

jest.setTimeout(10000)

describe('react-redux', () => {
  it('react-redux / dispatch time', async () => {
    const numOfDispatches = 10000
    const callCounter = jest.fn()
    const renderCounter = jest.fn()
    const selectCounter = jest.fn()

    type ReducerState = {
      count: number
    }

    const reducer = (state: ReducerState = { count: 0 }, action: any) => {
      switch (action.type) {
        case 'INCREMENT':
          callCounter()
          return { count: state.count + 1 }
        default:
          return state
      }
    }
    const store = createStore(reducer)

    const Component = () => {
      const count = useSelector((state: ReducerState) => {
        selectCounter()
        return state.count
      }, shallowEqual)

      renderCounter()
      return <div>{count}</div>
    }

    const div = document.createElement('div')
    await new Promise(r =>
      ReactDOM.render(
        <Provider store={store}>
          <Component />
        </Provider>,
        div,
        r,
      ),
    )

    console.time(`[react-redux] dispatch ${numOfDispatches} actions`)
    for (let count = 1; count < numOfDispatches + 1; count++) {
      store.dispatch({ type: 'INCREMENT' })
    }
    await new Promise(r => requestAnimationFrame(r))

    expect(div.innerHTML).toBe(`<div>${numOfDispatches}</div>`)
    expect(callCounter.mock.calls.length).toBe(numOfDispatches)
    console.timeEnd(`[react-redux] dispatch ${numOfDispatches} actions`)
    console.log(
      `[react-redux] dispatch ${numOfDispatches} actions: select state ${selectCounter.mock.calls.length} times`,
    )
    console.log(
      `[react-redux] dispatch ${numOfDispatches} actions: re-renders Component ${renderCounter.mock.calls.length} times`,
    )
  })

  it('react-redux / Store update time', async () => {
    const numOfStores = 1000
    const callCounter = jest.fn()
    const renderCounter = jest.fn()
    const selectCounter = jest.fn()

    type ReducerState = {
      count: number
    }

    const reducers = Array.from(Array(numOfStores)).reduce(
      (reducers, _, idx) => {
        reducers[`reducer${idx}`] = (
          state: ReducerState = { count: 0 },
          action: any,
        ) => {
          switch (action.type) {
            case 'INCREMENT':
              callCounter()
              return { count: state.count + 1 }
            default:
              return state
          }
        }

        return reducers
      },
      {},
    )

    const store = createStore(combineReducers(reducers))
    const reducerKeys = Object.keys(reducers)

    const Component = () => {
      const sum = useSelector((state: { [reducer: string]: ReducerState }) => {
        selectCounter()
        return reducerKeys.reduce((accum, key) => accum + state[key].count, 0)
      }, shallowEqual)

      renderCounter()

      return <>{sum}</>
    }

    const div = document.createElement('div')
    await new Promise(r =>
      ReactDOM.render(
        <Provider store={store}>
          <Component />
        </Provider>,
        div,
        r,
      ),
    )

    console.time(`[react-redux] Update ${numOfStores} stores once`)
    batch(() => store.dispatch({ type: 'INCREMENT' }))
    await new Promise(r => requestAnimationFrame(r))

    expect(div.innerHTML).toBe(`${numOfStores}`)
    expect(callCounter.mock.calls.length).toBe(numOfStores)
    console.timeEnd(`[react-redux] Update ${numOfStores} stores once`)
    console.log(
      `[react-redux] Update ${numOfStores} stores once: select state ${selectCounter.mock.calls.length} times`,
    )
    console.log(
      `[react-redux] Update ${numOfStores} stores once: re-renders Component ${renderCounter.mock.calls.length} times`,
    )
  })
})
