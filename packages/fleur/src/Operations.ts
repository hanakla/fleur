import OperationContext from './OperationContext'

export interface Operation {
  (context: OperationContext, arg: any): Promise<void> | void
}

export type OperationArg<T> = T extends (_: any, arg: infer A) => any
  ? A
  : never

/** Make Operation group from objects */
export const operations = <T extends { [name: string]: Operation }>(
  operations: T,
): { [K in keyof T]: T[K] } => {
  return operations
}

/** Make one Operation function */
export const operation = <T extends Operation>(op: T) => op
