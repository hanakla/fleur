import {
  OperationContextWithInternalAPI,
  OperationContext,
} from './OperationContext'

export type AnyOperationDef = (
  _: OperationContext,
  ...args: any
) => Promise<void> | void

/** Marked as `operations` wrappped Operation type */
export type Operation = AnyOperationDef

export type OperationAborter = {
  abort: {
    (context: OperationContext): void
    byKey: (key?: string) => (context: OperationContext) => void
  }
}

export type DefToOperation<T extends AnyOperationDef> = T & OperationAborter

export type OperationArgs<T> = T extends (_: any, ...args: infer A) => any
  ? A
  : never

/** Make Operation group from objects */
export const operations = <T extends { [name: string]: AnyOperationDef }>(
  operations: T,
): { [K in keyof T]: DefToOperation<T[K]> } => {
  const ops: any = {}

  Object.keys(operations).forEach((key) => {
    ops[key] = operation(operations[key])
  })

  return ops
}

/** Make one Operation function */
export const operation = <T extends AnyOperationDef>(
  op: T,
): DefToOperation<T> => {
  const opp: DefToOperation<T> = ((
    context: OperationContext,
    ...args: any[]
  ) => {
    return op(context, ...args)
  }) as DefToOperation<T>

  const abort = (context: OperationContextWithInternalAPI) => {
    return abort.byKey()(context)
  }

  abort.byKey = (key?: string) => {
    return (context: OperationContextWithInternalAPI) => {
      context.getExecuteMap(opp)?.get(key)?.abort()
    }
  }

  opp.abort = abort

  return opp
}
