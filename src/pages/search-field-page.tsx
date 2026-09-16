import { useState } from 'react'
import { SearchField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { SearchField } from '@catpkgs/coffee-ui'

<SearchField
  label="Search recipes"
  hideLabel
  value={query}
  onValueChange={setQuery}
  onSearch={runSearch}
/>`

const recipes = ['Flat white', 'Cortado', 'Cold brew', 'Espresso tonic', 'Affogato', 'Café de olla']

export default function SearchFieldPage() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const results = recipes.filter((recipe) => recipe.toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <PrimitivePage title="SearchField" description="A search input with an icon and a clear button. Enter calls onSearch, and Escape clears the text. Use hideLabel when the context makes the purpose obvious." code={code}>
      <div className="max-w-sm space-y-3">
        <SearchField label="Search recipes" hideLabel placeholder="Search recipes…" value={query} onValueChange={setQuery} onSearch={setSubmitted} />
        <ul className="space-y-1 text-sm">
          {results.map((recipe) => <li key={recipe}>{recipe}</li>)}
        </ul>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{results.length} results{submitted ? ` · last search: “${submitted}”` : ''}</p>
    </PrimitivePage>
  )
}
