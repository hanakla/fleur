import { Store, operation, action, listen } from '@fleur/fleur'
import { mockOperationContext } from './mockOperationContext'
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
    const increaseOp = operation(async (context, increase: number) => {
      await context.executeOperation(resetCountOp)
      context.dispatch(increaseAction, { increase })
    })

    const context = mockOperationContext({
      stores: [mockStore(CountStore, { count: 100 })],
    })

    // Spec
    await context.executeOperation(increaseOp, 100)

    expect(context.dispatchs[0]).toMatchObject({
      action: resetAction,
      payload: {},
    })

    expect(context.dispatchs[1]).toMatchObject({
      action: increaseAction,
      payload: { increase: 100 },
    })

    expect(context.getStore(CountStore).getCount()).toBe(100)
  })
})
