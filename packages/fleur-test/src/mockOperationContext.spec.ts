import Fleur, { Store, operation, action, listen } from '@ragg/fleur'
import { mockOperationContext } from './MockOperationContext'
import { mockStore } from './mockStore'

describe('mockOperationContext', () => {
  it('Example', async () => {
    // Actions.ts
    const resetAction = action<{}>()
    const increaseAction = action<{ increase: number }>()

    // CountStore.ts
    class CountStore extends Store<{ count: number }> {
      public static storeName = 'CountStore'

      protected state = { count: 0 }
      private resetCount = listen(resetAction, () =>
        this.updateWith(state => (state.count = 0)),
      )
      private increaseCount = listen(increaseAction, payload =>
        this.updateWith(state => (state.count += payload.increase)),
      )
      getCount() {
        return this.state.count
      }
    }

    // Operations.ts
    const resetCountOp = operation(context => {
      context.dispatch(resetAction, {})
    })
    const increaseOp = operation(async (context, arg) => {
      await context.executeOperation(resetCountOp, {})
      context.dispatch(increaseAction, { increase: 10 })
    })

    const context = mockOperationContext({
      stores: [mockStore(CountStore, { count: 100 })],
    })

    // Spec
    await context.executeOperation(increaseOp, { increase: 100 })
    expect(context.dispatchs[0]).toMatchObject({
      action: resetAction,
      payload: {},
    })
    expect(context.dispatchs[1]).toMatchObject({
      action: increaseAction,
      payload: { increase: 10 },
    })
    expect(context.getStore(CountStore).getCount()).toBe(10)
  })
})
