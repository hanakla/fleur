import { ActionIdentifier, Operation } from '@fleur/fleur'
import { MockedOperationContext, MockedComponentContext } from '@fleur/testing'
import * as deepEqual from 'fast-deep-equal'
import { matcherHint, printDiffOrStringify } from 'jest-matcher-utils'

export const toDispatchAction = (
  context: MockedOperationContext,
  expectedAction: ActionIdentifier<any>,
  expectedPayload: any,
): jest.CustomMatcherResult => {
  let actionMatchedPayload: any = null

  for (const dispatch of context.dispatches) {
    if (dispatch.action === expectedAction) {
      actionMatchedPayload = dispatch.payload

      if (deepEqual(dispatch.payload, expectedPayload)) {
        return {
          pass: true,
          message: () => `Expect to dispatch action \`${expectedAction.name}\``,
        }
      }

      continue
    }
  }

  return {
    pass: false,
    message: actionMatchedPayload
      ? () =>
          matcherHint(
            '.toDispatchAction',
            'context',
            `${expectedAction.name}, payload`,
          ) +
          `\nAction is dispatched, but payload is different.\n` +
          printDiffOrStringify(
            expectedPayload,
            actionMatchedPayload,
            'Expected',
            'Actual',
            true,
          )
      : () =>
          `Expect to dispatch action \`${expectedAction.name}\` but not dispatched`,
  }
}

export const toExecuteOperation = (
  context: MockedComponentContext,
  expectedOp: Operation,
  expectedArgs: any[],
): jest.CustomMatcherResult => {
  let actualArguments: any = null

  for (const execute of context.executes) {
    if (execute.op === expectedOp) {
      actualArguments = execute.args

      if (deepEqual(execute.args, expectedArgs)) {
        return {
          pass: true,
          message: () => `Expect to execute operation \`${execute.op.name}\``,
        }
      }

      continue
    }
  }

  return {
    pass: false,
    message: actualArguments
      ? () =>
          matcherHint('.toExecOperation', 'context', `op, ...args`) +
          `\nOperation is executed, but arguments is different.\n` +
          printDiffOrStringify(
            expectedArgs,
            actualArguments,
            'Expected',
            'Actual',
            true,
          )
      : () =>
          `Expect to execute operation \`${expectedOp.name}\` but not executed.`,
  }
}
