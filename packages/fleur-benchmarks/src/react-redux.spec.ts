import { createStore, combineReducers } from 'redux'
import { connect, Provider, batch } from 'react-redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

jest.setTimeout(10000)

describe('react-redux', () => {
  it('react-redux / dispatch time', async () => {
    const numOfDispatches = 10000
    const callCounter = jest.fn()

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

    const Component = connect((state: ReducerState) => state)(
      (props: ReducerState) => React.createElement('div', {}, `${props.count}`),
    )

    const div = document.createElement('div')
    const element = React.createElement(
      Provider,
      { store },
      React.createElement(Component),
    )
    await new Promise(r => ReactDOM.render(element, div, r))

    console.time(`react-redux dispatch action ${numOfDispatches} times`)
    for (let count = 1; count < numOfDispatches + 1; count++) {
      store.dispatch({ type: 'INCREMENT' })
    }
    await new Promise(r => requestAnimationFrame(r))

    expect(div.innerHTML).toBe(`<div>${numOfDispatches}</div>`)
    expect(callCounter.mock.calls.length).toBe(numOfDispatches)
    console.timeEnd(`react-redux dispatch action ${numOfDispatches} times`)
  })

  it('react-redux / Store update time', async () => {
    const numOfStores = 1000
    const callCounter = jest.fn()

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

    const Component = connect((state: { [reducer: string]: ReducerState }) => ({
      sum: Object.keys(reducers).reduce(
        (accum, key) => accum + state[key].count,
        0,
      ),
    }))(({ sum }: any) => `${sum}`)

    const div = document.createElement('div')
    const element = React.createElement(
      Provider,
      { store },
      React.createElement(Component),
    )
    await new Promise(r => ReactDOM.render(element, div, r))

    console.time(`react-redux update ${numOfStores} stores once`)
    batch(() => store.dispatch({ type: 'INCREMENT' }))
    await new Promise(r => requestAnimationFrame(r))

    expect(div.innerHTML).toBe(`${numOfStores}`)
    expect(callCounter.mock.calls.length).toBe(numOfStores)
    console.timeEnd(`react-redux update ${numOfStores} stores once`)
  })
})
