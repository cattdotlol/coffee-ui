import { useState } from 'react'
import type { ReactNode } from 'react'
import { FolderKanban, House, Inbox, Settings } from 'lucide-react'
import { Badge, Sidebar } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Link } from '@tanstack/react-router'
import { House, Inbox } from 'lucide-react'
import { Sidebar } from '@catpkgs/coffee-ui'

<Sidebar
  header={<p className="font-semibold">Acme</p>}
  groups={[
    { items: [
      { label: 'Home', href: '/', icon: <House /> },
      { label: 'Inbox', href: '/inbox', icon: <Inbox />, badge: <Badge>3</Badge> },
    ] },
  ]}
  // Your router sets aria-current="page" on the active link.
  renderLink={(item, props) => <Link to={item.href} {...props} />}
/>`

export default function SidebarPage() {
  const [active, setActive] = useState('Home')
  const item = (label: string, icon: ReactNode, badge?: ReactNode) => ({ label, icon, badge, active: active === label, onClick: () => setActive(label) })
  return (
    <PrimitivePage title="Sidebar" description="Grouped app navigation with icons, badges, header, and footer. Active items are marked with aria-current. Pass renderLink to use your router's link; this site's own sidebar is built with it." code={code}>
      <Sidebar
        className="w-60"
        label="Demo navigation"
        header={<p className="px-2.5 text-sm font-semibold">Acme</p>}
        groups={[
          { items: [item('Home', <House strokeWidth={1.5} />), item('Inbox', <Inbox strokeWidth={1.5} />, <Badge>3</Badge>)] },
          { label: 'Workspace', items: [item('Projects', <FolderKanban strokeWidth={1.5} />), item('Settings', <Settings strokeWidth={1.5} />)] },
        ]}
        footer={<p className="px-2.5 text-xs text-muted">Signed in as ada@acme.com</p>}
      />
    </PrimitivePage>
  )
}
