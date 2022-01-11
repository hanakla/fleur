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
})
