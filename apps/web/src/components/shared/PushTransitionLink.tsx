'use client'

import NextLink from 'next/link'
import { ComponentProps, useCallback } from 'react'
import usePushTransitionRouter from './usePushTransitionRouter'

type PushTransitionLinkProps = ComponentProps<typeof NextLink>

export default function PushTransitionLink({ onClick, ...props }: PushTransitionLinkProps) {
  const router = usePushTransitionRouter()
  const handleClick = useCallback<NonNullable<PushTransitionLinkProps['onClick']>>(
    (event) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      if (shouldPreserveDefault(event)) return

      const href = props.as ?? props.href
      if (typeof href !== 'string') return

      event.preventDefault()
      const navigate = props.replace ? router.replace : router.push
      navigate(href, { scroll: props.scroll ?? true })
    },
    [onClick, props.as, props.href, props.replace, props.scroll, router],
  )

  return <NextLink {...props} onClick={handleClick} />
}

function shouldPreserveDefault(event: Parameters<NonNullable<PushTransitionLinkProps['onClick']>>[0]) {
  const eventTarget = event.currentTarget
  const target = eventTarget.getAttribute('target')

  return (
    (target != null && target !== '_self') ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.nativeEvent.which === 2
  )
}
