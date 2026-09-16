import { useState } from 'react'
import { Rating } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Rating } from '@catpkgs/coffee-ui'

<Rating label="Rate this coffee" value={rating} onValueChange={setRating} />
<Rating label="Average rating" value={4} readOnly size="sm" />`

export default function RatingPage() {
  const [rating, setRating] = useState(0)
  return (
    <PrimitivePage title="Rating" description="Pick a score with stars. It's a group of native radio buttons underneath, so arrow keys change the value and screen readers announce each option. Use readOnly to display a score." code={code}>
      <div className="space-y-4">
        <Rating label="Rate this coffee" value={rating} onValueChange={setRating} />
        <div className="flex items-center gap-2 text-sm">
          <Rating label="Average rating" value={4} readOnly size="sm" />
          <span className="text-muted">4.0 from 128 reviews</span>
        </div>
        <Rating label="Locked rating" defaultValue={3} disabled />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{rating ? `You rated it ${rating} out of 5.` : 'No rating yet.'}</p>
    </PrimitivePage>
  )
}
