import { useState } from 'react'
import { Star } from 'lucide-react'
import { IconButton } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { Star } from 'lucide-react'
import { IconButton } from '@catpkgs/coffee-ui'

function FavoriteButton() {
  const [favorite, setFavorite] = useState(false)

  return (
    <IconButton
      aria-label="Favorite"
      aria-pressed={favorite}
      onClick={() => setFavorite(!favorite)}
    >
      <Star fill={favorite ? 'currentColor' : 'none'} strokeWidth={1.5} />
    </IconButton>
  )
}`

export default function IconButtonPage() {
  const [favorite, setFavorite] = useState(false)
  return (
    <PrimitivePage title="IconButton" description="A compact 36px action, with a larger target on touch devices. Always provide an aria-label; use aria-pressed for toggle actions. Supports the same variants as Button." code={code}>
      <div className="flex items-center gap-3">
        <IconButton aria-label="Favorite" aria-pressed={favorite} onClick={() => setFavorite(!favorite)}>
          <Star fill={favorite ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </IconButton>
        <p role="status" className="text-sm text-muted">{favorite ? 'Added to favorites' : 'Add to favorites'}</p>
      </div>
    </PrimitivePage>
  )
}
