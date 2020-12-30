import { keepAliveOperation } from './keepAliveOperation'
import { Fleur } from './Fleur'
import { action } from './Action'
import { OperationContext } from './OperationContext'
import Emitter from './Emitter'

describe('keepAliveOperation', () => {
  const app = new Fleur()
  const context = app.createContext()
  const ident = action<any>()

  it('Should work', async () => {
    const dispatchSpy = jest.spyOn(context, 'dispatch')

    const disposer = jest.fn()
    const spy = jest.fn(
      (context: OperationContext, connection: Emitter<any>, userId: number) => {
        // Listen events
        connection.on('message', data => {
          context.dispatch(ident, { data, userId })
        })

        // Return disposer, likes `() => connection.off()`, `() => clearInterval(pollingId)`
        // or any disposing process
        return () => {
          connection.off('message')
          disposer()
        }
      },
    )

    const connectionMock = new Emitter<any>()

    const op = keepAliveOperation(spy)
    await context.executeOperation(op, connectionMock, 1)
    expect(spy).toBeCalledWith(context.operationContext, connectionMock, 1)

    connectionMock.emit('message', 'message')
    expect(dispatchSpy).toBeCalledWith(ident, { data: 'message', userId: 1 })

    await context.executeOperation(op.dispose)
    expect(disposer).toBeCalled()
  })
})
