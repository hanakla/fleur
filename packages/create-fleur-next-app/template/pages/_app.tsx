import App, { AppProps } from 'next/app'
import { appWithFleurContext, FleurAppContext } from '../lib/fleur'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

MyApp.getInitialProps = async (appContext: FleurAppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)

  return { ...appProps }
}

export default appWithFleurContext(MyApp)
