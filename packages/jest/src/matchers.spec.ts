import './index'
import { reducerStore, operation, action } from '@fleur/fleur'
import { mockFleurContext } from '@fleur/testing'
import { mockStore } from '@fleur/testing'
import { toDispatchAction, toExecuteOperation } from './matchers'

describe('matchers', () => {
  const Store = reducerStore('Store', () => ({}))
  const act = action<{ test: string }>('action')
  const op = operation((context, text: string) =>
    context.dispatch(act, { test: text }),
  )

  const baseContext = mockFleurContext({
    stores: [mockStore(Store, {})],
  })

  describe('toDispatchAction', () => {
    it('Passed', async () => {
      const context = baseContext.derive().mockOperationContext()
      await context.executeOperation(op, 'hi')

      const result = toDispatchAction(context, act, { test: 'hi' })
      expect(result.pass).toBe(true)
      expect(result.message()).toMatchInlineSnapshot(
        `"Expect to dispatch action \`action\`"`,
      )
    })

    it('Action matched but different payload', async () => {
      const context = baseContext.derive().mockOperationContext()
      await context.executeOperation(op, 'hi')

      const result = toDispatchAction(context, act, { test: 'ha?' })
      expect(result.pass).toBe(false)
      expect(result.message()).toMatchSnapshot()
    })

    it('Action not matched', async () => {
      const unmatchedAct = action<{}>('unmatchedAction')
      const context = baseContext.derive().mockOperationContext()
      await context.executeOperation(op, 'hi')

      const result = toDispatchAction(context, unmatchedAct, { test: 'ha?' })
      expect(result.pass).toBe(false)
      expect(result.message()).toMatchInlineSnapshot(
        `"Expect to dispatch action \`unmatchedAction\` but not dispatched"`,
      )
    })
  })

  describe('toExecOperation', () => {
    it('Passed', async () => {
      const context = baseContext.derive().mockComponentContext()
      await context.executeOperation(op, 'hi')

      const result = toExecuteOperation(context, op, ['hi'])
      expect(result.pass).toBe(true)
      expect(result.message()).toMatchInlineSnapshot(
        `"Expect to execute operation \`\`"`,
      )
    })

    it('Operation matched but different payload', async () => {
      const context = baseContext.derive().mockComponentContext()
      await context.executeOperation(op, 'hi')

      const result = toExecuteOperation(context, op, ['ha?'])
      expect(result.pass).toBe(false)
      expect(result.message()).toMatchSnapshot()
    })

    it('Operation not matched', async () => {
      const unmatchedOp = operation(() => {})
      const context = baseContext.derive().mockComponentContext()
      await context.executeOperation(op, 'hi')

      const result = toExecuteOperation(context, unmatchedOp, ['hi'])
      expect(result.pass).toBe(false)
      expect(result.message()).toMatchInlineSnapshot(
        `"Expect to execute operation \`\` but not executed."`,
      )
    })
  })
})
