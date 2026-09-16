import { useState } from 'react'
import { Resizable } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Resizable } from '@catpkgs/coffee-ui'

<Resizable
  label="Resize sidebar"
  defaultSize={30}
  minSize={20}
  maxSize={60}
  start={<FileTree />}
  end={<Editor />}
/>

<Resizable orientation="vertical" label="Resize panels" start={<Code />} end={<Terminal />} />`

export default function ResizablePage() {
  const [size, setSize] = useState(35)
  return (
    <PrimitivePage title="Resizable" description="Two panels split by a draggable handle. The handle is a focusable separator: arrow keys resize it (hold Shift for bigger steps), and Home and End jump to the limits." code={code}>
      <div className="space-y-4">
        <Resizable label="Resize sidebar" size={size} onSizeChange={setSize} minSize={20} maxSize={70} className="h-48"
          start={<div className="h-full bg-subtle p-4 text-sm"><p className="font-medium">Files</p><p className="mt-1 text-muted">{Math.round(size)}%</p></div>}
          end={<div className="p-4 text-sm"><p className="font-medium">Editor</p><p className="mt-1 text-muted">Drag the handle or focus it and use arrow keys.</p></div>}
        />
        <Resizable label="Resize terminal" orientation="vertical" defaultSize={60} className="h-56"
          start={<div className="p-4 text-sm font-medium">Preview</div>}
          end={<div className="h-full bg-subtle p-4 font-mono text-xs text-muted">$ pnpm dev</div>}
        />
      </div>
    </PrimitivePage>
  )
}
