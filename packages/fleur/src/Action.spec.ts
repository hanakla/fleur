import { action, actions } from "./Action";

describe('Action', () => {
    it('Should named action', () => {
        const a = action('increment')
        expect(a.name).toBe('increment')
    })

    it('Should named action with object', () => {
        const a = actions('Counter', { increment: action(), decrement: action() })
        expect(a.increment.name).toBe('Counter/increment')
        expect(a.decrement.name).toBe('Counter/decrement')
    })
})
