import { Fleur } from './Fleur'
import { minOps } from './MinimalOps'

describe('MinimalOps', () => {
  type State = {
    text: string
    canvas: CanvasRenderingContext2D | null
  }

  const [TestStore, testOps] = minOps('Test', {
    ops: {
      setText: ({ state }, text: string) => {
        state.text = text
      },
      async checkImmediateUpdate(
        { state, updateImmediately },
        spy: (state: any) => void,
      ) {
        updateImmediately((s) => {
          s.text = 'AAAA'
        })

        spy(state) // expect to { text: 'AAAA' }
        await new Promise((r) => setTimeout(r, 100))

        state.text = 'BBBB'
      },
      async chainedOp1(x) {
        x.state.text = 'CHAINING'
        await x.executeOperation(testOps.chainedOp2)
        if (x.state.text !== 'COMPLETED') throw new Error('🐶')
      },
      chainedOp2(x) {
        if (x.state.text !== 'CHAINING') throw new Error('😂')
        x.state.text = 'COMPLETED'
      },
      async abortable(x) {
        x.acceptAbort()

        await new Promise((r) => setTimeout(r, 100))
        x.state.text = 'WOPP'
      },
    },
    initialState: (): State => ({
      text: 'hi',
      canvas: null,
    }),
  })

  const app = new Fleur({ stores: [TestStore] })

  it('test', async () => {
    const ctx = app.createContext()
    await ctx.executeOperation(testOps.setText, 'next')
    await ctx.executeOperation(testOps.setText.abort)
    await ctx.executeOperation(testOps.setText.abort.byKey('1'))
    expect(ctx.getStore(TestStore).state).toMatchObject({ text: 'next' })
  })

  it('updateImmediately', async () => {
    const ctx = app.createContext()
    const spy = jest.fn()
    const p = ctx.executeOperation(testOps.checkImmediateUpdate, spy)
    expect(ctx.getStore(TestStore).state.text).toBe('AAAA')
    expect(spy.mock.calls[0][0]).toEqual(
      expect.objectContaining({ text: 'AAAA' }),
    )

    await p
    expect(ctx.getStore(TestStore).state.text).toBe('BBBB')
  })

  it('chained operation call references latest state', async () => {
    const ctx = app.createContext()
    expect(() => ctx.executeOperation(testOps.chainedOp1)).not.toThrowError()
    expect(ctx.getStore(TestStore).state.text).toBe('COMPLETED')
  })

  it('abort to prevent changes', async () => {
    const ctx = app.createContext()
    ctx.executeOperation(testOps.abortable)
    await ctx.executeOperation(testOps.abortable.abort)

    expect(ctx.getStore(TestStore).state.text).toBe('hi')
  })
})
