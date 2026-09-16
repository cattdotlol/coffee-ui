import { RefreshCw, ThumbsDown, ThumbsUp } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from './cn.ts'
import CopyButton from './copy-button.tsx'
import IconButton from './icon-button.tsx'
import Toggle from './toggle.tsx'
import Toolbar from './toolbar.tsx'
import Tooltip from './tooltip.tsx'
import useControllableState from './use-controllable-state.ts'

export type MessageFeedback = 'up' | 'down' | null

export type MessageActionsProps = Omit<ComponentProps<'div'>, 'children'> & {
  content: string | (() => string)
  label?: string
  onRegenerate?: () => void
  feedback?: MessageFeedback
  defaultFeedback?: MessageFeedback
  onFeedbackChange?: (feedback: MessageFeedback) => void
}

export default function MessageActions({ content, label = 'Message actions', onRegenerate, feedback, defaultFeedback = null, onFeedbackChange, className, ...props }: MessageActionsProps) {
  const [current, setCurrent] = useControllableState(feedback, defaultFeedback, onFeedbackChange)

  return (
    <Toolbar {...props} label={label} className={cn('gap-0.5 border-0 bg-transparent p-0 text-muted', className)}>
      <Tooltip content="Copy"><CopyButton value={content} iconOnly size="sm" /></Tooltip>
      {onRegenerate && <Tooltip content="Regenerate"><IconButton aria-label="Regenerate" size="sm" onClick={onRegenerate}><RefreshCw strokeWidth={1.5} /></IconButton></Tooltip>}
      <Tooltip content="Good response">
        <Toggle aria-label="Good response" size="sm" className="ui-icon-button" pressed={current === 'up'} onPressedChange={(pressed) => setCurrent(pressed ? 'up' : null)}>
          <ThumbsUp aria-hidden="true" className={cn('size-3.5', current === 'up' && 'fill-current text-primary')} strokeWidth={1.5} />
        </Toggle>
      </Tooltip>
      <Tooltip content="Bad response">
        <Toggle aria-label="Bad response" size="sm" className="ui-icon-button" pressed={current === 'down'} onPressedChange={(pressed) => setCurrent(pressed ? 'down' : null)}>
          <ThumbsDown aria-hidden="true" className={cn('size-3.5', current === 'down' && 'fill-current text-primary')} strokeWidth={1.5} />
        </Toggle>
      </Tooltip>
    </Toolbar>
  )
}
