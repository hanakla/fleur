import Fleur from '@fleur/fleur'
import { AppStore } from './App'

const app = new Fleur({
  stores: [AppStore],
})

export const createContext = () => app.createContext()
