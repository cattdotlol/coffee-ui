import { Kbd } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Kbd } from '@catpkgs/coffee-ui'

<p>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search.</p>
<p>Press <Kbd>Esc</Kbd> to close.</p>`

const shortcuts = [
  { keys: ['⌘', 'K'], label: 'Open search' },
  { keys: ['⇧', '⌘', 'P'], label: 'Command palette' },
  { keys: ['Esc'], label: 'Close panel' },
]

export default function KbdPage() {
  return (
    <PrimitivePage title="Kbd" description="Displays keyboard input such as shortcuts. Uses the native kbd element so assistive technology can identify keys. Keep symbols recognizable or pair them with words." code={code}>
      <dl className="max-w-sm divide-y divide-border text-sm">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.label} className="flex min-h-10 items-center justify-between gap-3 py-2">
            <dt>{shortcut.label}</dt>
            <dd className="flex gap-1">{shortcut.keys.map((key) => <Kbd key={key}>{key}</Kbd>)}</dd>
          </div>
        ))}
      </dl>
    </PrimitivePage>
  )
}
