import { Link, linkStyles } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Link as RouterLink } from '@tanstack/react-router'
import { Link, linkStyles } from '@catpkgs/coffee-ui'

<Link href="/docs">Read the docs</Link>
<Link href="/terms" variant="muted">Terms</Link>
<Link href="https://github.com" external>GitHub</Link>

// Style your router's link the same way.
<RouterLink to="/settings" className={linkStyles({ variant: 'muted' })}>Settings</RouterLink>`

export default function LinkPage() {
  return (
    <PrimitivePage title="Link" description="Styled anchors for navigation. External links open in a new tab with a visible icon and a screen reader hint. Use linkStyles to apply the same look to your router's link component." code={code}>
      <div className="space-y-3 text-sm">
        <p>Need help? <Link href="#docs">Read the documentation</Link> or contact support.</p>
        <p className="flex flex-wrap gap-4">
          <Link href="#terms" variant="muted">Terms</Link>
          <Link href="#privacy" variant="muted">Privacy</Link>
          <Link href="https://github.com" external variant="plain">GitHub</Link>
        </p>
        <p><a href="#styled" className={linkStyles()}>A plain anchor using linkStyles</a></p>
      </div>
    </PrimitivePage>
  )
}
