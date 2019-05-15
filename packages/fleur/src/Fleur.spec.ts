import { action } from './Action'
import Fleur from './Fleur'
import { operation, operations } from './Operations'
import Store, { listen, store } from './Store'

describe('Fleur', () => {
  it('flows', async () => {
    const actions = {
      increase: action<{ increase: number }>('increase'),
      decrease: action<{ decrease: number }>('decrease'),
    }

    type State = { count: number }

    class TestStore extends Store {
      public static storeName = 'TestStore'
      public state: State = { count: 0 }

      private handleIncrease = listen(actions.increase, p => {
        this.state.count += p.increase
      })

      private handleDecrease = listen(actions.decrease, p => {
        this.state.count -= p.decrease
      })
    }

    const Test2Store = store<State>('Test2Store', () => ({ count: 0 }))
      .listen(actions.increase, (p, draft) => (draft.count += p.increase))
      .listen(actions.decrease, (p, draft) => (draft.count -= p.decrease))

    const app = new Fleur({
      stores: [TestStore, Test2Store],
    })
    const ctx = app.createContext()

    const ops = operations({
      increase(ctx, increase: number) {
        ctx.dispatch(actions.increase, { increase })
      },
      decrease(ctx, decrease: number) {
        ctx.dispatch(actions.decrease, { decrease })
      },
    })

    await ctx.executeOperation(ops.increase, 10)
    expect(ctx.getStore(TestStore).state.count).toBe(10)
    expect(ctx.getStore(Test2Store).state.count).toBe(10)

    await ctx.executeOperation(ops.decrease, 10)
    expect(ctx.getStore(TestStore).state.count).toBe(0)
    expect(ctx.getStore(Test2Store).state.count).toBe(0)
  })
})
