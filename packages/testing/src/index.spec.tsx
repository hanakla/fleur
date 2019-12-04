import * as React from 'react'
import { action, operation, reducerStore, selector } from '@fleur/fleur'
import { useStore, useFleurContext } from '@fleur/react'
import { mockFleurContext } from './mockFleurContext'
import { mockStore } from './mockStore'
import { useCallback } from 'react'
import { fireEvent, render } from '@testing-library/react'
import { TestingFleurContext } from './TestingFleurContext'

describe('@fleur/testing integration tests', () => {
  //
  // Actions.ts
  //
  const increaseAction = action<{ amount: number }>()

  // API.ts
  const postIncrease = async (amount: number): Promise<number> => {
    throw new Error('postIncrease must be mock')
  }

  //
  // Operations.ts
  //
  const increaseOp = operation(async ({ dispatch, getDep }, amount: number) => {
    await getDep(postIncrease)(1)
    dispatch(increaseAction, { amount })
  })

  //
  // Store.ts
  //
  interface State {
    count: number
  }

  const CounterStore = reducerStore<State>('CounterStore', () => ({
    count: 0,
  })).listen(increaseAction, (draft, { amount }) => {
    draft.count += amount
  })

  //
  // Selectors.ts
  //
  const getCount = selector(getState => getState(CounterStore).count)

  //
  // spec/mocks/AppContextMock.ts
  //
  const mockContext = mockFleurContext({
    stores: [mockStore(CounterStore, {})],
  })

  //
  // Operations.spec.ts
  //
  describe('Operation test', () => {
    const baseContext = mockContext.mockOperationContext()

    it('Should dispatch increaseAction with given amount', async () => {
      const context = baseContext.derive(({ injectDep }) => {
        injectDep(postIncrease, async (amount: number) => amount)
      })

      await context.executeOperation(increaseOp, 10)

      expect(context.dispatchs[0]).toMatchObject({
        action: increaseAction,
        payload: { amount: 10 },
      })
    })
  })

  //
  // Store.spec.ts
  //
  describe('Store test', () => {
    const baseContext = mockContext.mockOperationContext()

    it('Should increase count with given amount', () => {
      const context = baseContext.derive(({ deriveStore }) => {
        deriveStore(CounterStore, { count: 10 })
      })

      context.dispatch(increaseAction, { amount: 10 })

      expect(getCount(context.getStore)).toBe(20)
    })
  })

  //
  // Component.spec.ts
  //
  describe('Component test', () => {
    const baseContext = mockContext.mockComponentContext()

    const Component = ({ amount }: { amount: number }) => {
      const { executeOperation } = useFleurContext()
      const { count } = useStore(getStore => ({
        count: getCount(getStore),
      }))

      const handleClick = useCallback(() => {
        executeOperation(increaseOp, amount)
      }, [amount])

      return (
        <button type="button" onClick={handleClick} data-testid="button">
          Count: {count}
        </button>
      )
    }

    it('Should retrive count from store', async () => {
      const context = baseContext.derive(({ deriveStore }) => {
        deriveStore(CounterStore, { count: 30 })
      })

      const { findByTestId } = render(
        <TestingFleurContext value={context}>
          <Component amount={10} />
        </TestingFleurContext>,
      )

      const element = await findByTestId('button')
      expect(element.innerHTML).toBe('Count: 30')
    })

    it('Should increase count on click', async () => {
      const context = baseContext.derive(({ deriveStore }) => {
        deriveStore(CounterStore, { count: 100 })
      })

      const { findByTestId } = render(
        <TestingFleurContext value={context}>
          <Component amount={20} />
        </TestingFleurContext>,
      )

      expect(fireEvent.click(await findByTestId('button'))).toBe(true)

      expect(context.executes[0]).toMatchObject({
        op: increaseOp,
        args: [20],
      })
    })
  })
})
