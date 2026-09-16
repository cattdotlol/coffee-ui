import { Check, Lock } from 'lucide-react'
import { Badge } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Check } from 'lucide-react'
import { Badge } from '@catpkgs/coffee-ui'

<Badge variant="default">Published</Badge>
<Badge>Draft</Badge>
<Badge variant="outline">Archived</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge><Check aria-hidden="true" />Verified</Badge>`

export default function BadgePage() {
  return (
    <PrimitivePage title="Badge" description="Compact labels for status and metadata. Badges are not interactive; use a Button for actions. Pair icons with text so the meaning stays clear." code={code}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="default">Published</Badge>
        <Badge>Draft</Badge>
        <Badge variant="outline">Archived</Badge>
        <Badge variant="destructive">Failed</Badge>
        <Badge><Check aria-hidden="true" />Verified</Badge>
        <Badge variant="outline"><Lock aria-hidden="true" />Private</Badge>
      </div>
    </PrimitivePage>
  )
}
