import { Check, TriangleAlert, Wrench } from 'lucide-react'
import { cn } from './cn.ts'
import Badge from './badge.tsx'
import CodeBlock from './code-block.tsx'
import Collapsible from './collapsible.tsx'
import Spinner from './spinner.tsx'

export type ToolCallStatus = 'running' | 'success' | 'error'

export type ToolCallProps = {
  name: string
  status: ToolCallStatus
  input?: unknown
  output?: unknown
  error?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

function format(value: unknown) {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

export default function ToolCall({ name, status, input, output, error, open, defaultOpen, onOpenChange, className }: ToolCallProps) {
  return (
    <Collapsible
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={cn('rounded-panel border border-border bg-surface px-3 py-1', className)}
      title={
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <Wrench aria-hidden="true" className="size-4 shrink-0 text-muted" strokeWidth={1.5} />
          <span className="truncate font-mono text-xs">{name}</span>
          {status === 'running' && <Badge variant="outline" className="ml-auto"><Spinner size="sm" label="Running" className="[&_svg]:size-3" aria-hidden="true" />Running</Badge>}
          {status === 'success' && <Badge className="ml-auto"><Check aria-hidden="true" />Completed</Badge>}
          {status === 'error' && <Badge variant="destructive" className="ml-auto"><TriangleAlert aria-hidden="true" />Failed</Badge>}
        </span>
      }
    >
      <div className="space-y-2 pb-2">
        {input !== undefined && <CodeBlock code={format(input)} filename="Input" label={`${name} input`} />}
        {status === 'error' && error && <p className="text-xs leading-5 text-danger">{error}</p>}
        {status === 'success' && output !== undefined && <CodeBlock code={format(output)} filename="Output" label={`${name} output`} />}
        {status === 'running' && <p className="text-xs text-muted">Waiting for result…</p>}
      </div>
    </Collapsible>
  )
}
