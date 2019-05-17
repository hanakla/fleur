import { useComponentContext } from '@ragg/fleur-react'
import React, { useCallback, forwardRef } from 'react'
import { parse } from 'url'
import { navigateOp } from './navigateOp'

const isRoutable = (href: string | undefined) => {
  const parsed = parse(href || '')
  const current = parse(location.href)

  if (!href) return false
  if (href[0] === '#') return false
  if (parsed.protocol && parsed.protocol !== current.protocol) return false
  if (parsed.host && parsed.host !== location.host) return false
  return true
}

export const Link = forwardRef(
  (props: React.AnchorHTMLAttributes<HTMLAnchorElement>, ref) => {
    const { executeOperation } = useComponentContext()

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (props.onClick) props.onClick(e)
        if (e.isDefaultPrevented()) return
        if (!isRoutable(props.href)) return

        e.preventDefault()
        executeOperation(navigateOp, {
          url: parse(props.href!).pathname!,
        })
      },
      [],
    )

    return React.createElement('a', {
      ...props,
      ref,
      onClick: handleClick,
    })
  },
)
