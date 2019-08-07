import { Store, operation, action, listen } from '@fleur/fleur'
import { mockOperationContext } from './mockOperationContext'
import { mockStore } from './mockStore'

describe('mockOperationContext', () => {
  //
  // Actions.ts
  //
  const resetAction = action<{}>()
  const increaseAction = action<{ increase: number }>()

  //
  // CountStore.ts
  //
  class CountStore extends Store<{ count: number }> {
    public static storeName = 'CountStore'

    public state = { count: 0 }

    private resetCount = listen(resetAction, () =>
      this.updateWith(state => (state.count = 0)),
    )

    private increaseCount = listen(increaseAction, payload =>
      this.updateWith(state => (state.count += payload.increase)),
    )

    get count() {
      return this.state.count
    }
  }

  //
  // Operations.ts
  //
  const resetCountOp = operation(context => {
    context.dispatch(resetAction, {})
  })
  const increaseOp = operation(async (context, increase: number) => {
    await context.executeOperation(resetCountOp)
    context.dispatch(increaseAction, { increase })
  })

  //
  // spec/baseMock.ts
  //
  const baseContext = mockOperationContext({
    stores: [mockStore(CountStore, { count: 100 })],
  })

  it('Example', async () => {
    // Spec
    await baseContext.executeOperation(increaseOp, 100)

    expect(baseContext.dispatchs[0]).toMatchObject({
      action: resetAction,
      payload: {},
    })

    expect(baseContext.dispatchs[1]).toMatchObject({
      action: increaseAction,
      payload: { increase: 100 },
    })

    expect(baseContext.getStore(CountStore).count).toBe(100)
  })

  it('Derive store state', () => {
    const derivedContext = baseContext.derive(({ deriveStore }) => {
      deriveStore(CountStore, state => {
        state.count = 10
      })
    })

    const derivedContext2 = baseContext.derive(({ deriveStore }) => {
      deriveStore(CountStore, { count: 20 })
    })

    expect(baseContext.getStore(CountStore).count).toBe(100)
    expect(derivedContext.getStore(CountStore).count).toBe(10)
    expect(derivedContext2.getStore(CountStore).count).toBe(20)
  })
})
