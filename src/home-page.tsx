import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Accessibility, ArrowRight, Coffee, Minimize2, MoonStar, Paintbrush, Puzzle } from 'lucide-react'
import { Badge, Button, Card, CodeBlock, CopyButton, SegmentedControl, Switch, TextField, useToast } from '@catpkgs/coffee-ui'
import { groups } from './navigation.tsx'

const install = 'pnpm add @catpkgs/coffee-ui'

const quickStart = `import { Button, ToastProvider, useToast } from '@catpkgs/coffee-ui'

function SaveButton() {
  const { toast } = useToast()
  return <Button onClick={() => toast({ title: 'Saved' })}>Save</Button>
}

export default function App() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  )
}`

const features = [
  { icon: Accessibility, title: 'Accessible', text: 'Keyboard support, focus management, and screen reader labels in every component.' },
  { icon: Puzzle, title: 'Easy to use', text: 'One import, simple props, and state that works with or without control.' },
  { icon: Minimize2, title: 'Compact', text: 'Dense, pill-shaped controls that fit a lot on screen without feeling cramped.' },
  { icon: MoonStar, title: 'Light and dark', text: 'Warm latte and espresso themes built on a small set of design tokens.' },
]

const categories = groups.filter((group) => group.label !== 'Overview' && group.label !== 'Examples')
const componentCount = categories.reduce((total, group) => total + group.items.length, 0)

function Preview() {
  const { toast } = useToast()
  return (
    <Card
      title="Brew settings"
      description="A few components working together."
      footer={<>
        <Button variant="secondary" size="sm">Reset</Button>
        <Button size="sm" onClick={() => toast({ title: 'Brew saved', description: 'Your coffee preferences are up to date.', variant: 'success' })}>Save brew</Button>
      </>}
    >
      <div className="space-y-3">
        <TextField label="Name" defaultValue="Morning pour-over" />
        <SegmentedControl label="Roast" defaultValue="medium" options={[
          { value: 'light', label: 'Light' },
          { value: 'medium', label: 'Medium' },
          { value: 'dark', label: 'Dark' },
        ]} />
        <Switch label="Oat milk" defaultChecked />
      </div>
    </Card>
  )
}

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-3xl space-y-10">
      <section className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
        <div>
          <Badge variant="outline"><Coffee aria-hidden="true" />{componentCount} components</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Coffee UI</h1>
          <p className="mt-3 text-base leading-relaxed text-muted">Warm, compact React components with accessibility built in. Styled with Tailwind CSS and ready for light and dark mode.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/button" className="inline-flex min-h-9 items-center gap-1.5 rounded-control bg-primary px-3.5 text-sm font-medium text-on-primary hover:bg-primary-hover motion-safe:transition-colors pointer-coarse:min-h-11">
              Browse components<ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </Link>
            <Link to="/theme-studio" className="inline-flex min-h-9 items-center gap-1.5 rounded-control border border-border bg-surface px-3.5 text-sm font-medium shadow-xs hover:bg-subtle motion-safe:transition-colors pointer-coarse:min-h-11">
              <Paintbrush aria-hidden="true" className="size-4" strokeWidth={1.5} />Customize theme
            </Link>
          </div>
          <div className="mt-4 flex max-w-sm items-center gap-1 rounded-control border border-border bg-surface py-1 pr-1 pl-3.5">
            <code className="min-w-0 flex-1 truncate text-xs">{install}</code>
            <CopyButton value={install} label="Copy install command" iconOnly size="sm" />
          </div>
        </div>
        <Preview />
      </section>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Features</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3 rounded-panel border border-border bg-surface p-4">
              <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><Icon className="size-4" strokeWidth={1.5} /></span>
              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="quick-start-heading">
        <h2 id="quick-start-heading" className="mb-2 text-sm font-semibold">Quick start</h2>
        <CodeBlock code={quickStart} filename="app.tsx" label="Quick start code" />
      </section>

      <section aria-labelledby="components-heading">
        <h2 id="components-heading" className="mb-3 text-sm font-semibold">Components</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((group) => (
            <div key={group.label} className="rounded-panel border border-border bg-surface p-4">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">{group.label}</h3>
                <span className="text-xs tabular-nums text-muted">{group.items.length}</span>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="inline-flex min-h-7 items-center gap-1.5 rounded-control bg-subtle px-2.5 text-xs font-medium hover:bg-primary-soft hover:text-primary motion-safe:transition-colors pointer-coarse:min-h-11 [&>svg]:size-3.5">
                      {item.icon}{item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}
