import { AvatarGroup } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { AvatarGroup } from '@catpkgs/coffee-ui'

<AvatarGroup
  label="Project members"
  max={3}
  avatars={[
    { alt: 'Ada Lovelace', src: '/ada.jpg' },
    { alt: 'Grace Hopper' },
    { alt: 'Alan Turing' },
    { alt: 'Katherine Johnson' },
  ]}
/>`

const people = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Linus Torvalds', 'Margaret Hamilton'].map((alt) => ({ alt }))

export default function AvatarGroupPage() {
  return (
    <PrimitivePage title="AvatarGroup" description="A stack of overlapping avatars with a +N count for the rest. The group is labeled, and the overflow count lists the hidden names for screen readers and on hover." code={code}>
      <div className="space-y-4">
        <AvatarGroup label="Project members" avatars={people} max={3} size="sm" />
        <AvatarGroup label="Reviewers" avatars={people} max={4} />
        <AvatarGroup label="Owners" avatars={people.slice(0, 2)} size="lg" />
      </div>
    </PrimitivePage>
  )
}
