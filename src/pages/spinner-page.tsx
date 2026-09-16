import { useEffect, useState } from 'react'
import { Button, Spinner } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Spinner, Button } from '@catpkgs/coffee-ui'

<Spinner label="Loading results" />

<Button disabled={saving}>
  {saving && <Spinner size="sm" label="Saving" />}
  Save changes
</Button>`

export default function SpinnerPage() {
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!saving) return
    const timer = setTimeout(() => setSaving(false), 2000)
    return () => clearTimeout(timer)
  }, [saving])

  return (
    <PrimitivePage title="Spinner" description="Indicates that something is loading when duration is unknown. The spinner inherits the current text color and announces its label to assistive technology. Prefer Progress when you can measure completion." code={code}>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-muted"><Spinner size="sm" /></span>
        <Spinner />
        <Spinner size="lg" label="Loading results" />
        <Button disabled={saving} onClick={() => setSaving(true)}>
          {saving && <Spinner size="sm" label="Saving" />}
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </PrimitivePage>
  )
}
