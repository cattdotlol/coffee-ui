import { GitCommit, GitPullRequest, MessageSquare, Rocket } from 'lucide-react'
import { Timeline } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Rocket } from 'lucide-react'
import { Timeline } from '@catpkgs/coffee-ui'

<Timeline items={[
  { title: 'Deployed to production', time: '2h ago', icon: <Rocket />, active: true },
  { title: 'Pull request merged', time: 'Yesterday', description: 'Add date range picker' },
  { title: 'Project created', time: 'Sep 1', dateTime: '2026-09-01' },
]} />`

export default function TimelinePage() {
  return (
    <PrimitivePage title="Timeline" description="A vertical list of events in order. Mark the latest or current event as active, add icons for event types, and pass dateTime for machine-readable times." code={code}>
      <Timeline className="max-w-md" items={[
        { title: 'Deployed to production', time: '2h ago', icon: <Rocket strokeWidth={1.5} />, active: true, description: 'Version 0.4.0 is live.' },
        { title: 'Pull request merged', time: 'Yesterday', icon: <GitPullRequest strokeWidth={1.5} />, description: 'Add date range picker and tree view.' },
        { title: 'Review comment', time: 'Sep 14', dateTime: '2026-09-14', icon: <MessageSquare strokeWidth={1.5} />, description: 'Looks great, just one small nit about focus styles.' },
        { title: 'First commit', time: 'Sep 1', dateTime: '2026-09-01', icon: <GitCommit strokeWidth={1.5} /> },
      ]} />
    </PrimitivePage>
  )
}
