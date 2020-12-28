import { InternalOperationContext, OperationContext } from './OperationContext'

export interface OperationDef {
  (_: OperationContext, ...args: any[]): Promise<void> | void
}

export type OperationType = Operation | AbortOperation

export interface Operation extends OperationDef {
  abort: AbortOperation & OperationAborter
}

export interface AbortOperation extends OperationDef {
  readonly __abortOp: unique symbol
}

interface OperationAborter {
  (context: OperationContext): void
  of: (key: { key: string }) => AbortOperation
}

type DefToOperation<T extends OperationDef> = T & Operation

export type OperationArgs<T> = T extends (_: any, ...args: infer A) => any
  ? A
  : never

/** Make Operation group from objects */
export const operations = <T extends { [name: string]: OperationDef }>(
  operations: T,
): { [K in keyof T]: DefToOperation<T[K]> } => {
  const ops: any = {}

  Object.keys(operations).forEach(key => {
    ops[key] = operation(operations[key])
  })

  return ops
}

/** Make one Operation function */
export const operation = <T extends OperationDef>(op: T): DefToOperation<T> => {
  const opp: DefToOperation<T> = ((
    context: OperationContext,
    ...args: any[]
  ) => {
    return op(context, ...args)
  }) as DefToOperation<T>

  const abort = (context: InternalOperationContext) => {
    return abort.of()(context)
  }

  abort.of = ({ key }: { key?: string } = {}) => {
    return (context: InternalOperationContext) => {
      context
        .getExecuteMap(opp)
        ?.get(key)
        ?.abort()
    }
  }

  opp.abort = abort

  return opp
}
