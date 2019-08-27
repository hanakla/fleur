import App from 'next/app'
import { appWithFleurContext } from '../lib/fleur'

export default appWithFleurContext(class MyApp extends App {})
