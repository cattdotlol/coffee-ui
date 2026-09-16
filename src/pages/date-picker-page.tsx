import { useState } from 'react'
import { Calendar, DatePicker } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Calendar, DatePicker } from '@catpkgs/coffee-ui'

<DatePicker label="Start date" value={date} onValueChange={setDate} />

<DatePicker
  label="Delivery date"
  min={new Date()}
  isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
  name="delivery"
/>

// The calendar on its own.
<Calendar value={date} onValueChange={setDate} weekStartsOn={1} />`

export default function DatePickerPage() {
  const [date, setDate] = useState<Date | null>(null)
  const [day, setDay] = useState<Date | null>(new Date())
  return (
    <PrimitivePage title="DatePicker" description="Pick a date from a calendar popover. Arrow keys move by day and week, Page Up/Down by month (add Shift for year), and Home/End jump within the week. Calendar is also available on its own." code={code}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <DatePicker label="Start date" value={date} onValueChange={setDate} hint="Weekends are unavailable." min={new Date()} isDateDisabled={(value) => value.getDay() === 0 || value.getDay() === 6} />
          <DatePicker label="Locked" disabled defaultValue={new Date()} />
          <p role="status" className="text-sm text-muted">Start date: {date ? date.toDateString() : 'none'}</p>
        </div>
        <div>
          <Calendar value={day} onValueChange={setDay} weekStartsOn={1} />
        </div>
      </div>
    </PrimitivePage>
  )
}
