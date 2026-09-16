import { cloneElement } from 'react'
import type { ComponentProps, ReactElement, ReactNode, SyntheticEvent } from 'react'

export type TriggerElement = ReactElement<ComponentProps<'button'>>

type Handler<E> = ((event: E) => void) | undefined

function compose<E extends SyntheticEvent>(own: Handler<E>, added: Handler<E>) {
  return (event: E) => {
    own?.(event)
    if (!event.defaultPrevented) added?.(event)
  }
}

export function withTriggerProps(trigger: TriggerElement, props: ComponentProps<'button'>) {
  return cloneElement(trigger, {
    ...props,
    onClick: compose(trigger.props.onClick, props.onClick),
    onKeyDown: compose(trigger.props.onKeyDown, props.onKeyDown),
  })
}

export function renderWithClose(content: ReactNode | ((props: { close: () => void }) => ReactNode), close: () => void) {
  return typeof content === 'function' ? content({ close }) : content
}
