import { useState } from 'react'
import { CalendarClock, Copy, FileDown } from 'lucide-react'
import { SplitButton } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { CalendarClock, FileDown } from 'lucide-react'
import { SplitButton } from '@catpkgs/coffee-ui'

<SplitButton onClick={save} items={[
  { label: 'Save as template', icon: <FileDown />, onSelect: saveTemplate },
  { label: 'Schedule', icon: <CalendarClock />, onSelect: schedule },
]}>
  Save
</SplitButton>`

export default function SplitButtonPage() {
  const [message, setMessage] = useState('Use the main action or open the menu for more.')
  const items = [
    { label: 'Save as copy', icon: <Copy strokeWidth={1.5} />, onSelect: () => setMessage('Saved as a copy.') },
    { label: 'Save as template', icon: <FileDown strokeWidth={1.5} />, onSelect: () => setMessage('Saved as a template.') },
    { label: 'Schedule', icon: <CalendarClock strokeWidth={1.5} />, onSelect: () => setMessage('Scheduled for later.') },
  ]
  return (
    <PrimitivePage title="SplitButton" description="A primary action paired with a menu of related actions. The main button and the menu button are separate tab stops, and the menu supports the same keyboard controls as DropdownMenu." code={code}>
      <div className="flex flex-wrap items-center gap-3">
        <SplitButton items={items} onClick={() => setMessage('Saved.')}>Save</SplitButton>
        <SplitButton variant="secondary" items={items} onClick={() => setMessage('Saved.')}>Save</SplitButton>
        <SplitButton variant="outline" size="sm" items={items} onClick={() => setMessage('Saved.')}>Save</SplitButton>
        <SplitButton disabled items={items}>Save</SplitButton>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
