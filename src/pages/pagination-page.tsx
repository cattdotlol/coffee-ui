import { useState } from 'react'
import { Pagination } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { Pagination } from '@catpkgs/coffee-ui'

function Results() {
  const [page, setPage] = useState(1)

  return <Pagination page={page} pageCount={12} onPageChange={setPage} />
}

// siblingCount controls how many pages show around the current one.
<Pagination page={6} pageCount={20} siblingCount={2} onPageChange={setPage} />`

export default function PaginationPage() {
  const [page, setPage] = useState(1)
  return (
    <PrimitivePage title="Pagination" description="Navigate between pages of results. The current page is marked with aria-current, and long ranges collapse with an ellipsis while keeping the first and last pages visible." code={code}>
      <Pagination page={page} pageCount={12} onPageChange={setPage} />
      <p role="status" className="mt-4 text-sm text-muted">Showing page {page} of 12.</p>
    </PrimitivePage>
  )
}
