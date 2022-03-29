import { action } from './Action'
import { Fleur } from './Fleur'
import { minOps } from './MinimalOps'

describe('MinimalOps', () => {
  type State = {
    text: string
    records: { name: string }[]
    canvas: CanvasRenderingContext2D | null
  }

  const [TestStore, testOps] = minOps('Test', {
    initialState: (): State => ({
      text: 'hi',
      records: [
        { name: 'blossom' },
        { name: 'bubbles' },
        { name: 'buttercup' },
      ],
      canvas: null,
    }),
    ops: {
      setText: ({ commit }, text: string) => {
        commit({ text })
      },
      async checkCommit({ getState, commit }, spy: (state: any) => void) {
        commit({ text: 'AAAA' })

        spy(getState()) // expect to { text: 'AAAA' }
        await new Promise((r) => setTimeout(r, 100))

        commit({ text: 'BBBB' })
      },
      async chainedOp1(x) {
        x.commit({ text: 'CHAINING' })
        await x.executeOperation(testOps.chainedOp2)
        if (x.getState().text !== 'COMPLETED') throw new Error('🐶')
      },
      chainedOp2(x) {
        if (x.state.text !== 'CHAINING') throw new Error('😂')
        x.commit({ text: 'COMPLETED' })
      },
      async abortable(x) {
        x.acceptAbort()

        await new Promise((r) => setTimeout(r, 100))
        x.commit({ text: 'WOPP' })
      },
    },
  })

  const app = new Fleur({ stores: [TestStore] })

  it('test', async () => {
    const ctx = app.createContext()
    await ctx.executeOperation(testOps.setText, 'next')
    await ctx.executeOperation(testOps.setText.abort)
    await ctx.executeOperation(testOps.setText.abort.byKey('1'))
    expect(ctx.getStore(TestStore).state).toMatchObject({ text: 'next' })
  })

  it('commit', async () => {
    const ctx = app.createContext()
    const spy = jest.fn()
    const p = ctx.executeOperation(testOps.checkCommit, spy)
    expect(ctx.getStore(TestStore).state.text).toBe('AAAA')
    expect(spy.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        text: 'AAAA',
        records: [
          { name: 'blossom' },
          { name: 'bubbles' },
          { name: 'buttercup' },
        ],
      }),
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

  it('listen external actions', async () => {
    const ident = action<{ next: string }>()

    const [ExtraStore, externalOps] = minOps('external', {
      ops: {
        dispatch(x) {
          x.dispatch(ident, { next: 'ok' })
        },
      },
      initialState: () => ({}),
    })

    const [Store] = minOps('test', {
      ops: {},
      listens: (on) => [
        on(ident, (state, { next }) => {
          state.text = next
        }),
      ],
      initialState: () => ({ text: '' }),
    })

    const ctx = new Fleur({ stores: [ExtraStore, Store] }).createContext()
    await ctx.executeOperation(externalOps.dispatch)

    expect(ctx.getStore(Store).state.text).toBe('ok')
  })
})
