import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, ButtonGroup, IconButton } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Button, ButtonGroup } from '@catpkgs/coffee-ui'

<ButtonGroup label="Pagination">
  <Button variant="outline">Previous</Button>
  <Button variant="outline">Next</Button>
</ButtonGroup>

<ButtonGroup label="Save options">
  <Button>Save</Button>
  <IconButton variant="primary" aria-label="More save options"><ChevronDown /></IconButton>
</ButtonGroup>`

export default function ButtonGroupPage() {
  const [month, setMonth] = useState(8)
  const label = new Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(2026, month, 1))
  return (
    <PrimitivePage title="ButtonGroup" description="Joins related buttons into a single control. Place buttons directly inside the group so their edges connect. Works best with the outline and primary variants." code={code}>
      <div className="flex flex-wrap items-center gap-4">
        <ButtonGroup label="Change month">
          <IconButton variant="outline" aria-label="Previous month" onClick={() => setMonth((month + 11) % 12)}><ChevronLeft strokeWidth={1.5} /></IconButton>
          <Button variant="outline" className="min-w-28">{label}</Button>
          <IconButton variant="outline" aria-label="Next month" onClick={() => setMonth((month + 1) % 12)}><ChevronRight strokeWidth={1.5} /></IconButton>
        </ButtonGroup>
        <ButtonGroup label="Save options">
          <Button>Save</Button>
          <IconButton variant="primary" aria-label="More save options" className="border-l-on-primary/20"><ChevronDown strokeWidth={1.5} /></IconButton>
        </ButtonGroup>
        <ButtonGroup label="View" orientation="vertical">
          <Button variant="outline">Day</Button>
          <Button variant="outline">Week</Button>
          <Button variant="outline">Month</Button>
        </ButtonGroup>
      </div>
    </PrimitivePage>
  )
}
