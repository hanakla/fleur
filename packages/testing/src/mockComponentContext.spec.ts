import { operation, action } from '@fleur/fleur'
import { mockComponentContext } from './mockComponentContext'
import { mockStore } from './mockStore'
import { reducerStore } from '@fleur/fleur'

describe('mockComponentContext', () => {
  //
  // Actions.ts
  //
  const resetAction = action<{}>()
  const increaseAction = action<{ increase: number }>()

  //
  // CountStore.ts
  //
  const CountStore = reducerStore<{ count: number }>('CountStore', () => ({
    count: 0,
  }))

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
  const baseContext = mockComponentContext({
    stores: [mockStore(CountStore, { count: 100 })],
  })

  it('Example', async () => {
    const context = baseContext.derive()
    await context.executeOperation(increaseOp, 100)

    expect(context.executes[0]).toMatchObject({
      action: resetAction,
      payload: {},
    })

    expect(context.executes[1]).toMatchObject({
      action: increaseAction,
      payload: { increase: 100 },
    })

    expect(context.getStore(CountStore).count).toBe(100)
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
