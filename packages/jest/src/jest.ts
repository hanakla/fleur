import { ActionIdentifier, Operation } from '@fleur/fleur'

declare global {
  namespace jest {
    interface Matchers<R> {
      toDispatchAction(action: ActionIdentifier<any>, payload: any): R
      toExecuteOperation(op: Operation, args: any[]): R
    }
  }
}
