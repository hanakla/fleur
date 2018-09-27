import * as React from 'react'
import { withComponentContext, ContextProp } from '@ragg/fleur-react';
import { navigateOperation } from '@ragg/fleur-route-store/src/navigateOperation'
import { parse } from 'url'


type Props = ContextProp & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const Link = withComponentContext(class Link extends React.Component<Props> {
    render() {
        const { context, onClick, ...rest } = this.props
        return React.createElement('a', [], { ...rest, onClick: this.handleClick })
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
        this.props.context.executeOperation(navigateOperation, {
            url: parse(this.props.href!).pathname!,
        })
    }
})
