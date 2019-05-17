import { ContextProp, withComponentContext } from '@ragg/fleur-react'
import * as React from 'react'
import { parse } from 'url'
import { navigateOp } from './navigateOp'

type Props = ContextProp & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const Link = withComponentContext(
  class Link extends React.Component<Props> {
    public render() {
      const { onClick, ...rest } = this.props
      return React.createElement('a', { ...rest, onClick: this.handleClick })
    }

    private isRoutable = () => {
      const { href } = this.props
      const parsed = parse(href || '')
      const current = parse(location.href)

      if (!href) return false
      if (href[0] === '#') return false
      if (parsed.protocol && parsed.protocol !== current.protocol) return false
      if (parsed.host && parsed.host !== location.host) return false
      return true
    }

    private handleClick = (e: React.MouseEvent) => {
      if (!this.isRoutable()) return

      e.preventDefault()
      this.props.executeOperation(navigateOp, {
        url: parse(this.props.href!).pathname!,
      })
    }
  },
)
