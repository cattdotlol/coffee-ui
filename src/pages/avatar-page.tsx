import { Avatar } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Avatar } from '@catpkgs/coffee-ui'

<Avatar src="/people/ada.jpg" alt="Ada Lovelace" />

// Initials come from alt when the image is missing or fails to load.
<Avatar alt="Grace Hopper" size="lg" />
<Avatar alt="Team Coffee" fallback="TC" size="sm" />`

export default function AvatarPage() {
  return (
    <PrimitivePage title="Avatar" description="A person or team image with an initials fallback. The fallback appears when there is no source or the image fails to load. Always provide alt text with the name." code={code}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Avatar alt="Grace Hopper" size="sm" />
          <Avatar alt="Ada Lovelace" />
          <Avatar alt="Alan Turing" size="lg" />
        </div>
        <div className="flex items-center gap-3">
          <Avatar src="/missing-avatar.png" alt="Katherine Johnson" />
          <div className="text-sm">
            <p className="font-medium">Katherine Johnson</p>
            <p className="text-xs leading-5 text-muted">Image failed to load, showing initials.</p>
          </div>
        </div>
        <div className="flex -space-x-2" role="group" aria-label="Project members">
          {['Grace Hopper', 'Ada Lovelace', 'Alan Turing', 'Linus Torvalds'].map((name) => <Avatar key={name} alt={name} size="sm" className="ring-2 ring-surface" />)}
        </div>
      </div>
    </PrimitivePage>
  )
}
