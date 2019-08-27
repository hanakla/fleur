import Fleur from '@fleur/fleur'
import { CounterStore } from './Counter/store'

const app = new Fleur({
  stores: [CounterStore],
})

export const createContext = () => app.createContext()
