import { AppContext } from './AppContext'
import { Fleur } from './Fleur'
import { operation, OperationType } from './Operations'
import { Store } from './Store'

describe('AppContext', () => {
  describe('dehydrate', () => {
    it('Should dehydrate', () => {
      class SomeStore extends Store {
        public static storeName = 'SomeStore'
        public state = { some: 1 }
      }
      class Some2Store extends Store {
        public static storeName = 'Some2Store'
        public state = { some2: 2 }
      }

      const app = new Fleur({
        stores: [SomeStore, Some2Store],
      })

      const ctx = app.createContext()

      ctx.getStore(SomeStore)
      ctx.getStore(Some2Store)

      expect(ctx.dehydrate()).toEqual({
        stores: {
          SomeStore: { some: 1 },
          Some2Store: { some2: 2 },
        },
      })
    })
  })

  describe('rehydrate', () => {
    it('Should dehydrate', () => {
      class SomeStore extends Store {
        public static storeName = 'SomeStore'
        public state = { some: 1 }
      }
      class Some2Store extends Store {
        public static storeName = 'Some2Store'
        public state = { some2: 2 }
      }

      const app = new Fleur({
        stores: [SomeStore, Some2Store],
      })

      const ctx = app.createContext()
      ctx.rehydrate({
        stores: { SomeStore: { some: 1 }, Some2Store: { some2: 2 } },
      })

      expect(ctx.getStore(SomeStore).state).toEqual({ some: 1 })
      expect(ctx.getStore(Some2Store).state).toEqual({ some2: 2 })
    })
  })

  describe('getStore', () => {
    class SomeStore extends Store {
      public static storeName = 'SomeStore'
      public state = { some: 1 }
    }

    const app = new Fleur({ stores: [SomeStore] })

    it('Should get Store instance from StoreClass', () => {
      const context = app.createContext()
      expect(context.getStore(SomeStore)).toBeInstanceOf(SomeStore)
    })

    it('Should get Store instance from store name', () => {
      const context = app.createContext()
      expect(context.getStore('SomeStore')).toBeInstanceOf(SomeStore)
    })
  })

  describe('depend', () => {
    const app = new Fleur()

    it('Should depend returns passing object', () => {
      const source = () => {}
      const context = app.createContext()
      expect(context.depend(source)).toBe(source)
    })
  })

  describe('Child contexts', () => {
    const app = new Fleur()

    it('Should passing methods', () => {
      const context = app.createContext()
      const spy = jest.fn()
      const op = operation(spy)

      context.executeOperation(op)
      const operationContext = spy.mock.calls[0][0]

      // It's wrapped for ignoring return value
      expect(operationContext.executeOperation).toBe(context.executeOperation)
      expect(operationContext.getStore).toBe(context.getStore)
      expect(operationContext.dispatch).toBe(context.dispatch)
      expect(operationContext.depend).toBe(context.depend)
    })
  })

  describe('OperationContext', () => {
    let context: AppContext

    beforeEach(() => {
      const app = new Fleur()
      context = app.createContext()
    })

    it('#executeOperation should receive arguments', () => {
      const spy = jest.fn()
      context.executeOperation((spy as unknown) as OperationType, 'a', 'b')

      const call = spy.mock.calls[0]
      expect(call[0].abort).toBeInstanceOf(Object)
      expect(call[0].abort.aborted).toBe(false)
      expect(call[0].abort.signal).toBeInstanceOf(AbortSignal)
      expect(call[0].acceptAbort).toBeInstanceOf(Function)
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

        const op = operation(async (context) => {
          context.acceptAbort()

          context.abort.onabort = abortSpy
          await new Promise((resolve) => setTimeout(resolve, 1000))
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
          context.acceptAbort(key)

          context.abort.onabort = () => abortSpy()
          await new Promise((resolve) => setTimeout(resolve, 1000))
          if (context.abort.aborted) return
          completedSpy(key)
        })

        context.executeOperation(op, 'aaa')
        context.executeOperation(op, 'bbb')
        context.executeOperation(op, 'ccc')
        context.executeOperation(op.abort.byKey('aaa'))
        context.executeOperation(op.abort.byKey('bbb'))
        await new Promise((resolve) => setTimeout(resolve, 1000))
        expect(abortSpy).toBeCalledTimes(2)
        expect(completedSpy).toBeCalledTimes(1)
        expect(completedSpy).toBeCalledWith('ccc')
      })
    })
  })
})
