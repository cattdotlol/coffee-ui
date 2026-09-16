import { useState } from 'react'
import { Combobox } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { Combobox } from '@catpkgs/coffee-ui'

const timezones = [
  { value: 'utc', label: 'UTC' },
  { value: 'europe-london', label: 'Europe/London' },
  { value: 'asia-tokyo', label: 'Asia/Tokyo' },
  { value: 'pacific-auckland', label: 'Pacific/Auckland', disabled: true },
]

function TimezonePicker() {
  const [timezone, setTimezone] = useState('utc')

  return (
    <Combobox
      label="Timezone"
      placeholder="Search timezones"
      options={timezones}
      value={timezone}
      onValueChange={setTimezone}
    />
  )
}`

const timezones = [
  { value: 'utc', label: 'UTC' },
  { value: 'america-new-york', label: 'America/New_York' },
  { value: 'america-los-angeles', label: 'America/Los_Angeles' },
  { value: 'america-sao-paulo', label: 'America/Sao_Paulo' },
  { value: 'europe-london', label: 'Europe/London' },
  { value: 'europe-berlin', label: 'Europe/Berlin' },
  { value: 'africa-nairobi', label: 'Africa/Nairobi' },
  { value: 'asia-dubai', label: 'Asia/Dubai' },
  { value: 'asia-kolkata', label: 'Asia/Kolkata' },
  { value: 'asia-tokyo', label: 'Asia/Tokyo' },
  { value: 'australia-sydney', label: 'Australia/Sydney' },
  { value: 'pacific-auckland', label: 'Pacific/Auckland (unavailable)', disabled: true },
]

export default function ComboboxPage() {
  const [timezone, setTimezone] = useState('utc')
  return (
    <PrimitivePage title="Combobox" description="A text input that filters a list of options as you type. Arrow keys move through results, Enter selects, and Escape closes the list and restores the current selection. Use Select when the list is short." code={code}>
      <div className="max-w-sm">
        <Combobox label="Timezone" placeholder="Search timezones" hint="Type to filter the list." options={timezones} value={timezone} onValueChange={setTimezone} />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Selected: {timezones.find((item) => item.value === timezone)?.label}</p>
    </PrimitivePage>
  )
}
