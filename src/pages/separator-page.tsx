import { Separator } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Separator } from '@catpkgs/coffee-ui'

<Separator />

<div className="flex items-center gap-3">
  <span>Personal</span>
  <Separator orientation="vertical" />
  <span>Private</span>
</div>

<Separator decorative={false} />`

export default function SeparatorPage() {
  return (
    <PrimitivePage title="Separator" description="A subtle horizontal or vertical divider. Decorative by default; set decorative to false when the divider represents a meaningful separation of content." code={code}>
      <div className="space-y-4 text-sm">
        <div><h2 className="font-medium">Workspace</h2><p className="mt-1 text-muted">A place for your personal projects.</p></div>
        <Separator decorative={false} />
        <div className="flex items-center gap-3 text-muted"><span>Personal</span><Separator orientation="vertical" /><span>Private</span><Separator orientation="vertical" /><span>1 member</span></div>
      </div>
    </PrimitivePage>
  )
}
