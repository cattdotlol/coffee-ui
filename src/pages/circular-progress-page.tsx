import { useState } from 'react'
import { CircularProgress, Slider } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { CircularProgress } from '@catpkgs/coffee-ui'

<CircularProgress label="Storage used" value={64} size="lg" />
<CircularProgress label="Uploading" value={30} size="sm" />
<CircularProgress label="Loading" />`

export default function CircularProgressPage() {
  const [value, setValue] = useState(64)
  return (
    <PrimitivePage title="CircularProgress" description="A compact ring for progress and capacity. Omit value for an indeterminate spinner. The small size hides the percentage, so pair it with visible text when the number matters." code={code}>
      <div className="flex flex-wrap items-center gap-6">
        <CircularProgress label="Storage used" value={value} size="lg" />
        <CircularProgress label="Storage used" value={value} />
        <CircularProgress label="Storage used" value={value} size="sm" />
        <CircularProgress label="Loading" />
      </div>
      <div className="mt-6 max-w-xs">
        <Slider label="Value" value={value} onValueChange={setValue} />
      </div>
    </PrimitivePage>
  )
}
