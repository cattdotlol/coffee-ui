import { useState } from 'react'
import { TimePicker } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { TimePicker } from '@catpkgs/coffee-ui'

<TimePicker label="Start time" value={time} onValueChange={setTime} />
<TimePicker label="Meeting" minuteStep={15} min="09:00" max="17:00" />`

export default function TimePickerPage() {
  const [time, setTime] = useState('09:30')
  return (
    <PrimitivePage title="TimePicker" description="A labeled time input built on the native control, so it follows the user's 12 or 24 hour clock and works with mobile time pickers. Values are HH:MM strings." code={code}>
      <div className="max-w-xs space-y-4">
        <TimePicker label="Start time" value={time} onValueChange={setTime} />
        <TimePicker label="Meeting" hint="Business hours, 15 minute steps." minuteStep={15} min="09:00" max="17:00" defaultValue="10:00" />
        <TimePicker label="Locked" defaultValue="12:00" disabled />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Start time: {time || 'none'}</p>
    </PrimitivePage>
  )
}
