import { Fleur } from './Fleur'
import { InternalOperationContext, OperationContext } from './OperationContext'
import { operation, OperationType } from './Operations'

describe('OperationContext', () => {
  let context: OperationContext

  beforeEach(() => {
    const app = new Fleur()
    context = app.createContext().operationContext
  })

  it('#executeOperation should receive arguments', () => {
    const spy = jest.fn()
    context.executeOperation((spy as unknown) as OperationType, 'a', 'b')

    const {
      abort,
      abortable,
      getExecuteMap,
      ...expectedContext
    } = context as InternalOperationContext

    const call = spy.mock.calls[0]
    expect(call[0]).toMatchObject(expectedContext)
    expect(call[0].abort).toBeInstanceOf(Object)
    expect(call[0].abort.aborted).toBe(false)
    expect(call[0].abort.signal).toBeInstanceOf(AbortSignal)
    expect(call[0].abortable).toBeInstanceOf(Function)
    expect(call[1]).toBe('a')
    expect(call[2]).toBe('b')
  })

  it('#executeOperation should returns Promise', () => {
    const op = operation(() => {})
    const returns = context.executeOperation(op)
    expect(returns).toBeInstanceOf(Promise)
  })

  describe('#executeOperaion should abortable', () => {
    it('abort latest run', async () => {
      const abortSpy = jest.fn()
      const abortedSpy = jest.fn()

      const op = operation(async context => {
        context.abortable()

        context.abort.onabort = abortSpy
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (context.abort.aborted) return
        abortedSpy()
      })

      context.executeOperation(op)
      context.executeOperation(op.abort)
      expect(abortSpy).toBeCalled()
      expect(abortedSpy).not.toBeCalled()
    })

    it('abort by key', async () => {
      const abortSpy = jest.fn()
      const completedSpy = jest.fn()

      const op = operation(async (context, key: string) => {
        context.abortable({ key })

        context.abort.onabort = () => abortSpy()
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (context.abort.aborted) return
        completedSpy(key)
      })

      context.executeOperation(op, 'aaa')
      context.executeOperation(op, 'bbb')
      context.executeOperation(op, 'ccc')
      context.executeOperation(op.abort.of({ key: 'aaa' }))
      context.executeOperation(op.abort.of({ key: 'bbb' }))
      await new Promise(resolve => setTimeout(resolve, 1000))
      expect(abortSpy).toBeCalledTimes(2)
      expect(completedSpy).toBeCalledTimes(1)
      expect(completedSpy).toBeCalledWith('ccc')
    })
  })
})
