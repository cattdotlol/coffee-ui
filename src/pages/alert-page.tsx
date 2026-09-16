import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Alert, Button } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Sparkles } from 'lucide-react'
import { Alert } from '@catpkgs/coffee-ui'

<Alert title="Scheduled maintenance">
  The dashboard will be read-only on Sunday from 2–4 AM.
</Alert>

// Add role="alert" only for messages that appear in response to an action.
<Alert variant="destructive" role="alert" title="Payment failed">
  Update your card details to keep your subscription active.
</Alert>

<Alert title="New editor available" icon={<Sparkles strokeWidth={1.5} />} />`

export default function AlertPage() {
  const [failed, setFailed] = useState(false)
  return (
    <PrimitivePage title="Alert" description={'An inline message for important, non-interactive information. Static alerts are read in page order; add role="alert" only when the message appears in response to an action.'} code={code}>
      <div className="space-y-3">
        <Alert title="Scheduled maintenance">The dashboard will be read-only on Sunday from 2–4 AM.</Alert>
        <Alert title="New editor available" icon={<Sparkles strokeWidth={1.5} />} />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setFailed(true)}>Simulate failed payment</Button>
          {failed && <Button variant="ghost" onClick={() => setFailed(false)}>Reset</Button>}
        </div>
        {failed && <Alert variant="destructive" role="alert" title="Payment failed">Update your card details to keep your subscription active.</Alert>}
      </div>
    </PrimitivePage>
  )
}
