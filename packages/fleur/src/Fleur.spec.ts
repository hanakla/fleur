import { action } from './Action'
import Fleur from './Fleur'
import { operation } from './Operations'
import Store, { listen } from './Store'

describe('Fleur', () => {
  it('flows', () => {
    const actions = {
      increase: action<{ increase: number }>('increase'),
      decrease: action<{ decrease: number }>('decrease'),
    }

    class TestStore extends Store {
      public static storeName = 'TestStore'
      public state: { count: number } = { count: 0 }

      private handleIncrease = listen(actions.increase, p => {
        this.state.count += p.increase
      })

      private handleDecrease = listen(actions.decrease, p => {
        this.state.count -= p.decrease
      })
    }

    const app = new Fleur({
      stores: [TestStore],
    })
    const ctx = app.createContext()
    ctx.getStore(TestStore)

    const increaseOperation = operation((ctx, arg: { increase: number }) => {
      ctx.dispatch(actions.increase, { increase: arg.increase })
    })

    ctx.executeOperation(increaseOperation, { increase: 10 })
  })
})
