import { useState } from 'react'
import { Inbox, Plus } from 'lucide-react'
import { Button, EmptyState } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Inbox, Plus } from 'lucide-react'
import { EmptyState, Button } from '@catpkgs/coffee-ui'

<EmptyState
  icon={<Inbox strokeWidth={1.5} />}
  title="No projects yet"
  description="Create a project to start organizing your work."
  action={<Button><Plus aria-hidden="true" className="size-4" strokeWidth={1.5} />New project</Button>}
/>`

export default function EmptyStatePage() {
  const [projects, setProjects] = useState<string[]>([])
  return (
    <PrimitivePage title="EmptyState" description="Explains why an area has no content and offers a clear next step. Keep the title short, and include an action when the user can fix the empty state themselves." code={code}>
      {projects.length ? (
        <div className="space-y-3">
          <ul className="divide-y divide-border rounded-panel border border-border text-sm">
            {projects.map((project) => <li key={project} className="px-3 py-2.5">{project}</li>)}
          </ul>
          <Button variant="ghost" onClick={() => setProjects([])}>Clear projects</Button>
        </div>
      ) : (
        <EmptyState
          icon={<Inbox strokeWidth={1.5} />}
          title="No projects yet"
          description="Create a project to start organizing your work."
          action={<Button onClick={() => setProjects(['Untitled project'])}><Plus aria-hidden="true" className="size-4" strokeWidth={1.5} />New project</Button>}
        />
      )}
    </PrimitivePage>
  )
}
