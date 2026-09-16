import type { ReactNode } from 'react'

type ExampleHeaderProps = {
  title: string
  description: string
  actions?: ReactNode
}

export default function ExampleHeader({ title, description, actions }: ExampleHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">Examples</p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-5 text-muted">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}
