import { useState } from 'react'
import { Copy, Pencil, Share2, Trash2 } from 'lucide-react'
import { ContextMenu } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Copy, Trash2 } from 'lucide-react'
import { ContextMenu } from '@catpkgs/coffee-ui'

<ContextMenu label="File actions" items={[
  { label: 'Copy', icon: <Copy />, shortcut: '⌘C', onSelect: copy },
  { label: 'Delete', icon: <Trash2 />, destructive: true, separatorBefore: true, onSelect: remove },
]}>
  <div tabIndex={0}>Right-click me</div>
</ContextMenu>`

export default function ContextMenuPage() {
  const [message, setMessage] = useState('Right-click the area, or focus it and press Shift+F10.')
  return (
    <PrimitivePage title="ContextMenu" description="A menu that opens at the pointer on right-click, or with Shift+F10 on a focused element. Shares its items and keyboard behavior with DropdownMenu. Always offer the same actions somewhere visible too." code={code}>
      <ContextMenu label="File actions" items={[
        { label: 'Rename', icon: <Pencil strokeWidth={1.5} />, onSelect: () => setMessage('Rename selected.') },
        { label: 'Copy', icon: <Copy strokeWidth={1.5} />, shortcut: '⌘C', onSelect: () => setMessage('Copy selected.') },
        { label: 'Share', icon: <Share2 strokeWidth={1.5} />, disabled: true },
        { label: 'Delete', icon: <Trash2 strokeWidth={1.5} />, destructive: true, separatorBefore: true, onSelect: () => setMessage('Delete selected. Nothing was deleted.') },
      ]}>
        <div tabIndex={0} aria-label="Report.pdf, press Shift+F10 for actions" className="flex h-36 select-none items-center justify-center rounded-panel border border-dashed border-border text-sm text-muted">
          Right-click here
        </div>
      </ContextMenu>
      <p role="status" className="mt-4 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
