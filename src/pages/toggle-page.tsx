import { useState } from 'react'
import { Bold, Code, Eye, Italic, PanelLeft, Pin, Underline } from 'lucide-react'
import { Toggle, ToggleGroup } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Bold, Italic, Pin, Underline } from 'lucide-react'
import { Toggle, ToggleGroup } from '@catpkgs/coffee-ui'

<Toggle pressed={pinned} onPressedChange={setPinned}>
  <Pin aria-hidden="true" className="size-4" strokeWidth={1.5} />
  Pin note
</Toggle>

<ToggleGroup
  label="Text formatting"
  iconOnly
  value={formats}
  onValueChange={setFormats}
  items={[
    { value: 'bold', label: 'Bold', icon: <Bold strokeWidth={1.5} /> },
    { value: 'italic', label: 'Italic', icon: <Italic strokeWidth={1.5} /> },
    { value: 'underline', label: 'Underline', icon: <Underline strokeWidth={1.5} /> },
  ]}
/>`

export default function TogglePage() {
  const [pinned, setPinned] = useState(false)
  const [formats, setFormats] = useState(['bold'])
  return (
    <PrimitivePage title="Toggle" description="A button that stays on or off, exposed with aria-pressed. ToggleGroup lets several toggles be on at once; use SegmentedControl when only one option can be active." code={code}>
      <div className="space-y-4">
        <Toggle pressed={pinned} onPressedChange={setPinned}>
          <Pin aria-hidden="true" className="size-4" strokeWidth={1.5} />
          {pinned ? 'Pinned' : 'Pin note'}
        </Toggle>
        <div className="flex flex-wrap gap-3">
          <ToggleGroup label="Text formatting" iconOnly value={formats} onValueChange={setFormats} items={[
            { value: 'bold', label: 'Bold', icon: <Bold strokeWidth={1.5} /> },
            { value: 'italic', label: 'Italic', icon: <Italic strokeWidth={1.5} /> },
            { value: 'underline', label: 'Underline', icon: <Underline strokeWidth={1.5} /> },
          ]} />
          <ToggleGroup label="Visible panels" defaultValue={['sidebar']} items={[
            { value: 'sidebar', label: 'Sidebar', icon: <PanelLeft strokeWidth={1.5} /> },
            { value: 'preview', label: 'Preview', icon: <Eye strokeWidth={1.5} /> },
            { value: 'code', label: 'Code', icon: <Code strokeWidth={1.5} />, disabled: true },
          ]} />
        </div>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">
        <span style={{ fontWeight: formats.includes('bold') ? 600 : 400, fontStyle: formats.includes('italic') ? 'italic' : 'normal', textDecoration: formats.includes('underline') ? 'underline' : 'none' }}>Formatted preview text</span>
        {pinned ? ' · pinned' : ''}
      </p>
    </PrimitivePage>
  )
}
