import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { CodeBlock } from '@catpkgs/coffee-ui'

type PrimitivePageProps = {
  title: string
  description: string
  code: string
  children: ReactNode
}

export default function PrimitivePage({ title, description, code, children }: PrimitivePageProps) {
  return (
    <motion.div key={title} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-2xl space-y-5">
      <header>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">Primitives</p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-5 text-muted">{description}</p>
      </header>
      <section aria-label="Live preview" className="rounded-panel border border-border bg-surface p-4 sm:p-5">
        {children}
      </section>
      <section aria-labelledby="usage-heading">
        <h2 id="usage-heading" className="mb-2 text-sm font-semibold">Usage</h2>
        <CodeBlock code={code} language="tsx" label={`${title} usage code`} />
      </section>
    </motion.div>
  )
}
