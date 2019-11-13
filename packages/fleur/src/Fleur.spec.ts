import { action, asyncAction } from './Action'
import { Fleur } from './Fleur'
import { operations } from './Operations'
import { Store, listen, reducerStore } from './Store'

describe('Fleur', () => {
  it('flows', async () => {
    const actions = {
      increase: action<{ increase: number }>('increase'),
      decrease: action<{ decrease: number }>('decrease'),
      fetch: asyncAction<{}, {}, {}>(),
    }

    class TestStore extends Store {
      public static storeName = 'TestStore'
      public state: { count: number } = { count: 0 }

      private handleIncrease = listen(actions.increase, p => {
        this.updateWith(state => (state.count += p.increase))
      })

      private handleDecrease = listen(actions.decrease, p => {
        this.updateWith(state => (state.count -= p.decrease))
      })
    }

    const Test2Store = reducerStore('Test2Store', () => ({
      count: 0,
      fetching: false,
    }))
      .listen(
        actions.increase,
        (draft, payload) => (draft.count += payload.increase),
      )
      .listen(
        actions.decrease,
        (draft, payload) => (draft.count -= payload.decrease),
      )
      .listen(actions.fetch.started, draft => (draft.fetching = true))
      .listen(actions.fetch.done, draft => (draft.fetching = false))

    const app = new Fleur({
      stores: [TestStore, Test2Store],
    })
    const ctx = app.createContext()
    ctx.getStore(TestStore)

    const ops = operations({
      increase({ dispatch }, increase: number) {
        dispatch(actions.increase, { increase })
      },
      decrease({ dispatch }, decrease: number) {
        dispatch(actions.decrease, { decrease })
      },
      fetchData({ dispatch }) {
        dispatch(actions.fetch.started, {})
        requestAnimationFrame(() => {
          dispatch(actions.fetch.done, {})
        })
      },
    })

    await ctx.executeOperation(ops.increase, 10)
    expect(ctx.getStore(TestStore).state.count).toBe(10)
    expect(ctx.getStore(Test2Store).state.count).toBe(10)

    await ctx.executeOperation(ops.decrease, 20)
    expect(ctx.getStore(TestStore).state.count).toBe(-10)
    expect(ctx.getStore(Test2Store).state.count).toBe(-10)

    await ctx.executeOperation(ops.fetchData)
    expect(ctx.getStore(Test2Store).state.fetching).toBe(true)
    await new Promise(r => requestAnimationFrame(r))
    expect(ctx.getStore(Test2Store).state.fetching).toBe(false)
  })
})
