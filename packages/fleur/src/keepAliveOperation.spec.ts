import { keepAliveOperation } from './keepAliveOperation'
import { Fleur } from './Fleur'
import { action } from './Action'
import { OperationContext } from './OperationContext'

describe('keepAliveOperation', () => {
  const app = new Fleur()
  const context = app.createContext()
  const ident = action<string>()

  it('Should work', async () => {
    const dispatchSpy = jest.spyOn(context, 'dispatch')

    const disposer = jest.fn()
    const spy = jest.fn((context: OperationContext, userId: number) => {
      setTimeout(() => context.dispatch(ident, 'payload'), 100)
      return disposer
    })

    const op = keepAliveOperation(spy)
    await context.executeOperation(op, 1)
    expect(spy).toBeCalledWith(context.operationContext, 1)

    await new Promise(r => setTimeout(r, 500))
    expect(dispatchSpy).toBeCalledWith(ident, 'payload')

    await context.executeOperation(op.dispose)
    expect(disposer).toBeCalled()
  })
})
