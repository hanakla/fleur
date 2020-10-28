import Fleur, {
  action,
  operation,
  AppContext,
  reducerStore,
  selector,
  selectorWithStore,
} from '@fleur/fleur'
import * as React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'

import { useStore } from './useStore'
import { FleurContext } from './ComponentReactContext'

describe('useStore', () => {
  // Action Identifier
  const ident = action<{ increase: number }>()

  // Operation
  const op = operation(context => {
    context.dispatch(ident, { increase: 10 })
  })

  // Store
  const TestStore = reducerStore<{
    count: number
    entities: Record<string, string>
  }>('TestStore', () => ({
    count: 10,
    entities: {
      '1': 'Foo',
      '2': 'Bar',
    },
  })).listen(ident, (draft, { increase }) => (draft.count += increase))

  const Test2Store = reducerStore('Test2Store', () => ({ test2: 'hi' }))

  // App
  const app = new Fleur({ stores: [TestStore, Test2Store] })

  const wrapperFactory = (context: AppContext) => {
    return ({ children }: { children: React.ReactNode }) =>
      React.createElement(FleurContext, { value: context }, children)
  }

  // selectors
  const getTest2 = selector(getState => getState(Test2Store).test2)
  const getMultiple = selectorWithStore(getStore => {
    getTest2(getStore)
    getStore(TestStore)
  })

  it('Should map stores to states', async () => {
    const context = app.createContext()
    const { result, rerender, unmount } = renderHook(
      () =>
        useStore(getStore => ({
          count: getStore(TestStore).state.count,
        })),
      { wrapper: wrapperFactory(context) },
    )

    expect(result.current).toMatchObject({ count: 10 })

    await act(async () => {
      await context.executeOperation(op)
      await new Promise(r => requestAnimationFrame(r))
    })

    expect(result.current).toMatchObject({ count: 20 })
    unmount()
  })

  it('Should map stores to state with variable selector', async () => {
    const context = app.createContext()

    let index: string = '1'
    const { result, rerender, unmount } = renderHook(
      () => useStore(getStore => getStore(TestStore).state.entities[index]),
      { wrapper: wrapperFactory(context) },
    )

    expect(result.current).toBe('Foo')

    index = '2'
    rerender()

    expect(result.current).toBe('Bar')
    unmount()
  })

  it('Should listen stores via deep selector', () => {
    const context = app.createContext()
    const { unmount } = renderHook(
      () => {
        useStore(getMultiple)
      },
      { wrapper: wrapperFactory(context) },
    )

    expect(context.getStore(TestStore)['listeners']).toHaveLength(1)
    expect(context.getStore(Test2Store)['listeners']).toHaveLength(1)

    unmount()
    expect(context.getStore(TestStore)['listeners']).toHaveLength(0)
    expect(context.getStore(Test2Store)['listeners']).toHaveLength(0)
  })

  it('Should unlisten on component unmounted', async () => {
    const context = app.createContext()
    const { unmount } = renderHook(
      () => {
        useStore(getStore => ({ count: getStore(TestStore).state.count }))
      },
      {
        wrapper: wrapperFactory(context),
      },
    )

    expect(context.getStore(TestStore)['listeners']).toHaveLength(1)
    unmount()
    expect(context.getStore(TestStore)['listeners']).toHaveLength(0)
  })
})
