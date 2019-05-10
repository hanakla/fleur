import OperationContext from './OperationContext'

export interface Operation {
  (_: OperationContext, ...args: any[]): Promise<void> | void
}

export type OperationArgs<T> = T extends (_: any, ...args: infer A) => any
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
