import { useState } from 'react'
import { Star } from 'lucide-react'
import { IconButton, Tooltip } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Star } from 'lucide-react'
import { IconButton, Tooltip } from '@catpkgs/coffee-ui'

<Tooltip content="Add to favorites">
  <IconButton aria-label="Favorite"><Star /></IconButton>
</Tooltip>`

export default function TooltipPage() {
  const [favorite, setFavorite] = useState(false)
  return (
    <PrimitivePage title="Tooltip" description="Short supplementary text on hover or keyboard focus. Wrap any focusable element; it is linked to the tooltip automatically. Escape dismisses it. Keep essential instructions outside the tooltip." code={code}>
      <div className="flex items-center gap-3">
        <Tooltip content={favorite ? 'Remove this item from your favorites.' : 'Add this item to your favorites.'}>
          <IconButton aria-label="Favorite" aria-pressed={favorite} onClick={() => setFavorite(!favorite)}>
            <Star fill={favorite ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </IconButton>
        </Tooltip>
        <p role="status" className="text-sm text-muted">{favorite ? 'Added to favorites.' : 'Hover or focus the star.'}</p>
      </div>
    </PrimitivePage>
  )
}
