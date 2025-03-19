import { ActionIdentifier } from './Action'
import { OperationArgs, Operation, AnyOperationDef } from './Operations'
import { StoreClass } from './Store'
import { ExtractPayloadType } from './Action'
import { Aborter, AborterSignal } from './Abort'

export interface OperationContext {
  executeOperation<O extends AnyOperationDef>(
    this: void,
    operator: O,
    ...args: OperationArgs<O>
  ): Promise<void>

  getStore<T extends StoreClass>(this: void, storeClass: T): InstanceType<T>

  dispatch<AI extends ActionIdentifier<any>>(
    this: void,
    type: AI,
    payload: ExtractPayloadType<AI>,
  ): void

  depend<T>(this: void, o: T): T

  finally: (cb: () => void) => void

  abort: AborterSignal
  acceptAbort: (key?: string) => void
}

export interface OperationContextWithInternalAPI extends OperationContext {
  getExecuteMap: (op: Operation) => Map<string | undefined, Aborter> | undefined
}
