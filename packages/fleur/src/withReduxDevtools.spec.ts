import Fleur, { action, Operation, operation } from './'
import { withReduxDevTools } from './withReduxDevtools'

describe('withReduxDevtools', () => {
  ;(window as any).__REDUX_DEVTOOLS_EXTENSION__ = () => {}
  ;(window as any).__REDUX_DEVTOOLS_EXTENSION__.connect = () => ({
    subscribe: () => {},
  })

  describe('Child contexts', () => {
    const app = new Fleur()

    it('Should passing methods', () => {
      const context = app.createContext()

      const opSpy = jest.fn(context => context.dispatch(ac, {}))
      const connectSpy = jest.fn()

      const ac = action<{}>('test')
      const op = operation(opSpy)

      Object.defineProperty(window, '__REDUX_DEVTOOLS_EXTENSION__', {
        get() {
          return {
            connect: () => ({ send: connectSpy, subscribe: () => {} }),
          }
        },
      })

      withReduxDevTools(context)
      context.executeOperation(op)

      expect(opSpy).toBeCalled()
      expect(connectSpy.mock.calls[0][0]).toMatchObject({
        type: ac.name,
        payload: {},
      })
    })
  })
})
