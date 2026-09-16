import { Breadcrumb } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Link } from '@tanstack/react-router'
import { Breadcrumb } from '@catpkgs/coffee-ui'

<Breadcrumb items={[
  { label: 'Projects', href: '/projects' },
  { label: 'Coffee UI', href: '/projects/coffee-ui' },
  { label: 'Settings' },
]} />

// Use renderLink to render your router's link component.
<Breadcrumb
  items={items}
  renderLink={(item, props) => <Link to={item.href} {...props} />}
/>`

export default function BreadcrumbPage() {
  return (
    <PrimitivePage title="Breadcrumb" description="Shows where the current page sits in a hierarchy. The last item is the current page and is marked with aria-current. Pass renderLink to use your router's link component." code={code}>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Projects', href: '#projects' }, { label: 'Coffee UI', href: '#coffee-ui' }, { label: 'Settings' }]} />
        <Breadcrumb aria-label="Folder path" items={[{ label: 'Documents', href: '#documents' }, { label: 'Design', href: '#design' }, { label: 'Components', href: '#components' }, { label: 'Tokens', href: '#tokens' }, { label: 'colors.json' }]} />
      </div>
    </PrimitivePage>
  )
}
