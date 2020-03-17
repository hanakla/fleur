import { Fleur } from './Fleur'
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
      withReduxDevTools(context)

      const { componentContext, operationContext } = context

      console.log(context.dispatch === operationContext.dispatch)

      // It's wrapped for ignoring return value
      expect(componentContext.executeOperation).toBeInstanceOf(Function)
      expect(componentContext.getStore).toBe(context.getStore)
      expect(componentContext.depend).toBe(context.depend)

      expect(operationContext.executeOperation).toBe(context.executeOperation)
      expect(operationContext.getStore).toBe(context.getStore)
      expect(operationContext.dispatch).toBe(context.dispatch)
      expect(operationContext.depend).toBe(context.depend)
    })
  })
})
