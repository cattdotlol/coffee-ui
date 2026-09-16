import { useState } from 'react'
import { FileCode, FileText, Folder } from 'lucide-react'
import { TreeView } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { TreeView } from '@catpkgs/coffee-ui'

<TreeView
  label="Project files"
  defaultExpanded={['src']}
  selected={file}
  onSelectedChange={setFile}
  items={[
    { id: 'src', label: 'src', children: [
      { id: 'main', label: 'main.tsx' },
      { id: 'app', label: 'app.tsx' },
    ] },
    { id: 'readme', label: 'README.md' },
  ]}
/>`

const folder = <Folder strokeWidth={1.5} />
const codeFile = <FileCode strokeWidth={1.5} />
const textFile = <FileText strokeWidth={1.5} />

export default function TreeViewPage() {
  const [file, setFile] = useState<string | null>('button')
  return (
    <PrimitivePage title="TreeView" description="A hierarchical list you can expand and select. Up and Down move between visible items, Right expands or enters a folder, Left collapses or returns to the parent, and Enter selects." code={code}>
      <TreeView
        label="Project files"
        className="max-w-xs"
        defaultExpanded={['src', 'components']}
        selected={file}
        onSelectedChange={setFile}
        items={[
          { id: 'src', label: 'src', icon: folder, children: [
            { id: 'components', label: 'components', icon: folder, children: [
              { id: 'button', label: 'button.tsx', icon: codeFile },
              { id: 'dialog', label: 'dialog.tsx', icon: codeFile },
            ] },
            { id: 'main', label: 'main.tsx', icon: codeFile },
            { id: 'styles', label: 'index.css', icon: codeFile },
          ] },
          { id: 'public', label: 'public', icon: folder, children: [{ id: 'favicon', label: 'favicon.svg', icon: textFile }] },
          { id: 'lock', label: 'pnpm-lock.yaml', icon: textFile, disabled: true },
          { id: 'readme', label: 'README.md', icon: textFile },
        ]}
      />
      <p role="status" className="mt-4 text-sm text-muted">Selected: {file ?? 'nothing'}</p>
    </PrimitivePage>
  )
}
