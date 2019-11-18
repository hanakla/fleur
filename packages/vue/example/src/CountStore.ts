import { reducerStore } from '@fleur/fleur'
import { CounterActions } from './CounterActions'

export const CountStore = reducerStore('CountStore', () => ({
  count: 0,
})).listen(CounterActions.increase, draft => {
  draft.count++
  console.log({ ...draft })
})
