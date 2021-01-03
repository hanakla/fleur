import { operation, action } from '@fleur/fleur'
import { mockComponentContext } from './mockComponentContext'
import { mockStore } from './mockStore'
import { reducerStore } from '@fleur/fleur'
import { useFleurContext } from '@fleur/react'
import { fireEvent, render } from '@testing-library/react'
import { useCallback, createElement } from 'react'
import { TestingFleurContext } from './TestingFleurContext'

describe('mockComponentContext', () => {
  //
  // Actions.ts
  //
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
  const increaseOp = operation(async (context, increase: number) => {
    context.dispatch(increaseAction, { increase })
  })

  //
  // Component.tsx
  //
  const Component = () => {
    const { executeOperation } = useFleurContext()
    const handleClick = useCallback(() => executeOperation(increaseOp, 10), [])
    return createElement(
      'button',
      { 'data-testid': 'button', type: 'button', onClick: handleClick },
      'Button',
    )
  }

  //
  // spec/baseMock.ts
  //
  const baseContext = mockComponentContext({
    stores: [mockStore(CountStore, { count: 100 })],
    mocks: new Map(),
  })

  it('Example', async () => {
    const context = baseContext.derive()

    const component = render(
      createElement(TestingFleurContext, {
        value: context,
        children: createElement(Component),
      }),
    )

    expect(fireEvent.click(await component.findByTestId('button'))).toBe(true)
    await new Promise(resolve => requestAnimationFrame(resolve))

    expect(context.mock.executes[0]).toMatchObject({
      op: increaseOp,
      args: [10],
    })

    expect(context.getStore(CountStore).state.count).toBe(100)
  })
})
