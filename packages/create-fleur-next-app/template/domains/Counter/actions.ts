import { actions, action } from '@fleur/fleur'

export const CounterActions = actions('Counter', {
  increment: action<{ amount: number }>(),
})
