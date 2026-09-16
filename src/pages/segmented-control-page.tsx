import { useState } from 'react'
import { SegmentedControl } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { SegmentedControl } from '@catpkgs/coffee-ui'

function ViewPicker() {
  const [view, setView] = useState('list')

  return (
    <SegmentedControl
      label="View"
      value={view}
      onValueChange={setView}
      options={[
        { value: 'list', label: 'List' },
        { value: 'board', label: 'Board' },
        { value: 'timeline', label: 'Timeline', disabled: true },
      ]}
    />
  )
}`

export default function SegmentedControlPage() {
  const [view, setView] = useState('list')
  return (
    <PrimitivePage title="SegmentedControl" description="Choose one option from a small set, such as a view mode. Tab focuses the selected option; arrow keys move and select. Use Tabs instead when each option reveals a panel of content." code={code}>
      <SegmentedControl label="View" value={view} onValueChange={setView} options={[
        { value: 'list', label: 'List' },
        { value: 'board', label: 'Board' },
        { value: 'calendar', label: 'Calendar' },
        { value: 'timeline', label: 'Timeline', disabled: true },
      ]} />
      <p role="status" className="mt-4 text-sm text-muted">Current view: {view}.</p>
    </PrimitivePage>
  )
}
