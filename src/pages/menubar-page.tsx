import { useState } from 'react'
import { Clipboard, Copy, FilePlus, FolderOpen, Redo2, Save, Scissors, Trash2, Undo2 } from 'lucide-react'
import { Menubar } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { FilePlus, Save, Undo2 } from 'lucide-react'
import { Menubar } from '@catpkgs/coffee-ui'

<Menubar label="Editor" menus={[
  { label: 'File', items: [
    { label: 'New file', icon: <FilePlus />, shortcut: '⌘N', onSelect: create },
    { label: 'Save', icon: <Save />, shortcut: '⌘S', onSelect: save },
  ] },
  { label: 'Edit', items: [
    { label: 'Undo', icon: <Undo2 />, shortcut: '⌘Z', onSelect: undo },
  ] },
  { label: 'Help', disabled: true, items: [] },
]} />`

export default function MenubarPage() {
  const [message, setMessage] = useState('Open a menu to try the menubar.')
  const select = (label: string) => () => setMessage(`${label} selected.`)
  const menus = [
    { label: 'File', items: [
      { label: 'New file', icon: <FilePlus strokeWidth={1.5} />, shortcut: '⌘N', onSelect: select('New file') },
      { label: 'Open', icon: <FolderOpen strokeWidth={1.5} />, shortcut: '⌘O', onSelect: select('Open') },
      { label: 'Save', icon: <Save strokeWidth={1.5} />, shortcut: '⌘S', onSelect: select('Save') },
      { label: 'Move to trash', icon: <Trash2 strokeWidth={1.5} />, destructive: true, separatorBefore: true, onSelect: select('Move to trash') },
    ] },
    { label: 'Edit', items: [
      { label: 'Undo', icon: <Undo2 strokeWidth={1.5} />, shortcut: '⌘Z', onSelect: select('Undo') },
      { label: 'Redo', icon: <Redo2 strokeWidth={1.5} />, shortcut: '⇧⌘Z', disabled: true },
      { label: 'Cut', icon: <Scissors strokeWidth={1.5} />, shortcut: '⌘X', separatorBefore: true, onSelect: select('Cut') },
      { label: 'Copy', icon: <Copy strokeWidth={1.5} />, shortcut: '⌘C', onSelect: select('Copy') },
      { label: 'Paste', icon: <Clipboard strokeWidth={1.5} />, shortcut: '⌘V', onSelect: select('Paste') },
    ] },
    { label: 'View', items: [
      { label: 'Zoom in', shortcut: '⌘+', onSelect: select('Zoom in') },
      { label: 'Zoom out', shortcut: '⌘-', onSelect: select('Zoom out') },
      { label: 'Full screen', shortcut: '⌃⌘F', separatorBefore: true, onSelect: select('Full screen') },
    ] },
    { label: 'Help', disabled: true, items: [] },
  ]
  return (
    <PrimitivePage title="Menubar" description="A persistent row of menus for app-style commands. Arrow keys move between menus and through items, and hovering switches menus once one is open." code={code}>
      <Menubar label="Editor" menus={menus} />
      <p role="status" className="mt-4 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
