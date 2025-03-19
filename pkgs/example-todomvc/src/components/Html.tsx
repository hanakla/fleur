import React from 'react'

export const Html = ({
  children,
  state,
}: {
  children: string
  state: string
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>React • TodoMVC</title>
      <link rel="stylesheet" href="public/base.css" />
      <link rel="stylesheet" href="public/index.css" />
      <script dangerouslySetInnerHTML={{ __html: state }} />
    </head>
    <body>
      <section
        className="todoapp"
        dangerouslySetInnerHTML={{ __html: children }}
      />
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="http://github.com/remojansen/">Remo H. Jansen</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
      <script type="text/javascript" src="public/base.js" />
      <script type="text/javascript" src="dist/client.js" />
    </body>
  </html>
)
