import { useState } from 'react'
import { Coffee } from 'lucide-react'
import { Button, Tag } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Coffee } from 'lucide-react'
import { Tag } from '@catpkgs/coffee-ui'

<Tag>Espresso</Tag>
<Tag variant="primary" icon={<Coffee />}>Featured</Tag>
<Tag variant="outline" onRemove={() => removeFilter('decaf')}>Decaf</Tag>`

const initial = ['Light roast', 'Ethiopia', 'Pour-over', 'Under $20']

export default function TagPage() {
  const [filters, setFilters] = useState(initial)
  return (
    <PrimitivePage title="Tag" description="Compact labels for filters, categories, and selections. Add onRemove for a dismiss button with an accessible name. Use Badge for read-only status." code={code}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag>Espresso</Tag>
          <Tag variant="primary" icon={<Coffee strokeWidth={1.5} />}>Featured</Tag>
          <Tag variant="outline">Seasonal</Tag>
        </div>
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Active filters" role="group">
          {filters.map((filter) => <Tag key={filter} variant="outline" onRemove={() => setFilters(filters.filter((item) => item !== filter))}>{filter}</Tag>)}
          {filters.length < initial.length && <Button variant="link" size="sm" onClick={() => setFilters(initial)}>Reset</Button>}
        </div>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{filters.length} filters active.</p>
    </PrimitivePage>
  )
}
