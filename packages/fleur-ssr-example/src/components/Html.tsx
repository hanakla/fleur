import * as React from 'react'
import { HelmetData } from 'react-helmet'


interface Props {
  helmet: HelmetData
  state: string
  children: string
}


export class Html extends React.Component<Props> {
  render() {
    const { helmet, state, children } = this.props

    return (
      <html>
        <head>
          {helmet.title.toComponent()}
          <script dangerouslySetInnerHTML={{ __html: state }}></script>
          <script src='/public/client.js' />
        </head>
        <body>
          <div id='root' dangerouslySetInnerHTML={{ __html: children }} />
        </body>
      </html>
    )
  }
}
