import { useState } from 'react'
import { Copy, Download, Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { DropdownMenu, IconButton } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { DropdownMenu, IconButton } from '@catpkgs/coffee-ui'

<DropdownMenu trigger="Actions" items={[
  { label: 'Edit', icon: <Pencil />, shortcut: '⌘E', onSelect: edit },
  { label: 'Export', disabled: true },
  { label: 'Delete', icon: <Trash2 />, destructive: true, separatorBefore: true, onSelect: remove },
]} />

// Any button element can be the trigger.
<DropdownMenu
  trigger={<IconButton aria-label="More actions"><Ellipsis /></IconButton>}
  align="end"
  items={items}
/>`

export default function DropdownMenuPage() {
  const [message, setMessage] = useState('Choose an action to try the menu.')
  const items = [
    { label: 'Edit', icon: <Pencil strokeWidth={1.5} />, shortcut: '⌘E', onSelect: () => setMessage('Edit selected.') },
    { label: 'Duplicate', icon: <Copy strokeWidth={1.5} />, shortcut: '⌘D', onSelect: () => setMessage('Duplicate selected.') },
    { label: 'Export', icon: <Download strokeWidth={1.5} />, disabled: true },
    { label: 'Delete', icon: <Trash2 strokeWidth={1.5} />, destructive: true, separatorBefore: true, onSelect: () => setMessage('Delete selected. This preview does not delete anything.') },
  ]
  return (
    <PrimitivePage title="DropdownMenu" description="Compact action menus with icons, shortcuts, and disabled or destructive items. Use arrow keys, Home, End, or type an item name. Pass a string or any button element as the trigger." code={code}>
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu trigger="Actions" items={items} />
        <DropdownMenu trigger={<IconButton aria-label="More actions"><Ellipsis strokeWidth={1.5} /></IconButton>} align="end" items={items} />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
