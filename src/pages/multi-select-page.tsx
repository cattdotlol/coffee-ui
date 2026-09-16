import { useState } from 'react'
import { MultiSelect } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { MultiSelect } from '@catpkgs/coffee-ui'

<MultiSelect
  label="Labels"
  placeholder="Add labels"
  options={[
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'docs', label: 'Documentation' },
  ]}
  value={labels}
  onValueChange={setLabels}
  maxSelected={3}
/>`

const options = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'docs', label: 'Documentation' },
  { value: 'design', label: 'Design' },
  { value: 'performance', label: 'Performance' },
  { value: 'security', label: 'Security' },
  { value: 'wontfix', label: "Won't fix", disabled: true },
]

export default function MultiSelectPage() {
  const [labels, setLabels] = useState(['bug'])
  return (
    <PrimitivePage title="MultiSelect" description="Choose several options from a searchable list, shown as removable tags. Enter toggles the highlighted option and Backspace removes the last tag. Use maxSelected to cap the selection." code={code}>
      <div className="max-w-sm">
        <MultiSelect label="Labels" placeholder="Add labels" hint="Up to 3 labels." options={options} value={labels} onValueChange={setLabels} maxSelected={3} />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Selected: {labels.join(', ') || 'none'}</p>
    </PrimitivePage>
  )
}
