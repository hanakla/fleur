import * as invariant from 'invariant'
import { Operation } from './Operations'
import { OperationContext } from './OperationContext'

type Disposer = (() => void) | void

interface KeepAliveOperation {
  (context: OperationContext): Promise<void>
  dispose: Operation
}

export const keepAliveOperation = (
  operator: (context: OperationContext) => Promise<Disposer> | Disposer,
): KeepAliveOperation => {
  let disposer: (() => void) | void
  let alived = false

  const operation: KeepAliveOperation = async (context: OperationContext) => {
    invariant(alived === false, 'Keep alive operation already started.')

    disposer = await operator(context)
    alived = true
  }

  operation.dispose = async () => {
    await (disposer && disposer())
    alived = false
  }

  return operation
}

// const websockOperator = keepAliveOperation(async ctx => {
//   const con = await io('aaaa')

//   con.onmessage = payload => {
//     ctx.dispatch(someAction, {})
//   }

//   return () => con.disconnect()
// })

// context.executeOperation(websockOperator)
// context.executeOperation(websockOperator.dispose)
