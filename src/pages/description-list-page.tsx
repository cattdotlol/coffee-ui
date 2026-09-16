import { Badge, CopyButton, DescriptionList } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Badge, DescriptionList } from '@catpkgs/coffee-ui'

<DescriptionList items={[
  { label: 'Name', value: 'Coffee UI' },
  { label: 'Status', value: <Badge variant="default">Active</Badge> },
  { label: 'Created', value: 'September 16, 2026' },
]} />

<DescriptionList orientation="vertical" items={items} />`

export default function DescriptionListPage() {
  return (
    <PrimitivePage title="DescriptionList" description="Label and value pairs for details and settings pages, using native dl, dt, and dd elements. Rows stack on small screens; use the vertical orientation for narrow layouts." code={code}>
      <DescriptionList items={[
        { label: 'Project', value: 'Coffee UI' },
        { label: 'Status', value: <Badge variant="default">Active</Badge> },
        { label: 'Project ID', value: <span className="inline-flex items-center gap-1 font-mono text-xs">prj_8f3k2m<CopyButton value="prj_8f3k2m" label="Copy project ID" iconOnly size="sm" /></span> },
        { label: 'Created', value: 'September 16, 2026' },
        { label: 'Description', value: 'A calm, minimal component library built with React and Tailwind CSS.' },
      ]} />
    </PrimitivePage>
  )
}
