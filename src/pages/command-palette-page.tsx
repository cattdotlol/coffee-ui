import { useState } from 'react'
import { FilePlus, Moon, Search, Settings, UserPlus } from 'lucide-react'
import { Button, CommandPalette, Kbd } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { FilePlus, Settings } from 'lucide-react'
import { Button, CommandPalette } from '@catpkgs/coffee-ui'

// Opens with ⌘K / Ctrl+K by default. Set hotkey={null} to disable.
<CommandPalette
  trigger={<Button variant="outline">Search commands</Button>}
  groups={[
    { label: 'Actions', items: [
      { label: 'New file', icon: <FilePlus />, shortcut: '⌘N', onSelect: createFile },
    ] },
    { label: 'Navigation', items: [
      { label: 'Settings', icon: <Settings />, keywords: ['preferences'], onSelect: openSettings },
    ] },
  ]}
/>`

export default function CommandPalettePage() {
  const [message, setMessage] = useState('Run a command to see it here.')
  return (
    <PrimitivePage title="CommandPalette" description="A searchable list of actions in a modal. Opens with ⌘K or Ctrl+K, filters as you type (including keywords), and runs the highlighted command with Enter." code={code}>
      <div className="flex flex-wrap items-center gap-3">
        <CommandPalette
          trigger={<Button variant="outline"><Search aria-hidden="true" className="size-4" strokeWidth={1.5} />Search commands</Button>}
          groups={[
            { label: 'Actions', items: [
              { label: 'New file', icon: <FilePlus strokeWidth={1.5} />, shortcut: '⌘N', onSelect: () => setMessage('Created a new file.') },
              { label: 'Invite teammate', icon: <UserPlus strokeWidth={1.5} />, keywords: ['member', 'user'], onSelect: () => setMessage('Opened invite flow.') },
              { label: 'Toggle dark mode', icon: <Moon strokeWidth={1.5} />, keywords: ['theme'], disabled: true, onSelect: () => {} },
            ] },
            { label: 'Navigation', items: [
              { label: 'Settings', icon: <Settings strokeWidth={1.5} />, keywords: ['preferences'], onSelect: () => setMessage('Navigated to settings.') },
            ] },
          ]}
        />
        <p className="text-sm text-muted">or press <Kbd>⌘</Kbd> <Kbd>K</Kbd></p>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
