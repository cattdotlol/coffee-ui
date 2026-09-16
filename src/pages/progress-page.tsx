import { useState } from 'react'
import { Button, Progress } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Progress } from '@catpkgs/coffee-ui'

<Progress label="Uploading files" value={40} />
<Progress label="Storage used" value={7.2} max={10} />

// Omit value when progress can't be measured.
<Progress label="Preparing export" />`

export default function ProgressPage() {
  const [value, setValue] = useState(20)
  return (
    <PrimitivePage title="Progress" description="Shows how much of a task is complete. Omit value for an indeterminate state when progress can't be measured. The label names the task for assistive technology." code={code}>
      <div className="max-w-sm space-y-5">
        <Progress label="Uploading files" value={value} />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={value >= 100} onClick={() => setValue(Math.min(value + 20, 100))}>Advance</Button>
          <Button variant="ghost" disabled={value === 0} onClick={() => setValue(0)}>Reset</Button>
        </div>
        <Progress label="Preparing export" />
      </div>
    </PrimitivePage>
  )
}
