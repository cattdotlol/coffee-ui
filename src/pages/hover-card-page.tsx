import { Avatar, HoverCard, Link } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Avatar, HoverCard, Link } from '@catpkgs/coffee-ui'

<HoverCard content={
  <div className="flex gap-3">
    <Avatar alt="Ada Lovelace" />
    <div>
      <p className="font-medium">Ada Lovelace</p>
      <p className="text-xs text-muted">Wrote the first published algorithm.</p>
    </div>
  </div>
}>
  <Link href="/people/ada">@ada</Link>
</HoverCard>`

export default function HoverCardPage() {
  return (
    <PrimitivePage title="HoverCard" description="A rich preview that appears after hovering or focusing a link. It's supplementary: keep everything essential reachable from the link's destination. Escape dismisses it." code={code}>
      <p className="text-sm">
        Commit authored by{' '}
        <HoverCard content={
          <div className="flex gap-3">
            <Avatar alt="Ada Lovelace" size="lg" />
            <div className="min-w-0">
              <p className="font-medium">Ada Lovelace</p>
              <p className="text-xs text-muted">@ada · Joined March 2024</p>
              <p className="mt-2 text-xs leading-5 text-muted">Mathematician. Wrote the first published algorithm.</p>
            </div>
          </div>
        }>
          <Link href="#ada">@ada</Link>
        </HoverCard>
        {' '}two hours ago.
      </p>
    </PrimitivePage>
  )
}
