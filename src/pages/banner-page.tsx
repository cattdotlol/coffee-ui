import { Megaphone, TriangleAlert } from 'lucide-react'
import { Banner, Button, Link } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Megaphone } from 'lucide-react'
import { Banner, Button } from '@catpkgs/coffee-ui'

<Banner
  variant="primary"
  icon={<Megaphone />}
  title="New:"
  action={<Button size="sm" variant="secondary">Try it</Button>}
  dismissible
>
  Date range picker is here.
</Banner>`

export default function BannerPage() {
  return (
    <PrimitivePage title="Banner" description="A page-wide announcement for news, maintenance, or account issues. It's a labeled region so people can find it again, and can include an action and a dismiss button." code={code}>
      <div className="space-y-3">
        <Banner variant="primary" icon={<Megaphone strokeWidth={1.5} />} title="New:" action={<Button size="sm" variant="secondary">Try it</Button>} dismissible>
          Date range picker is here.
        </Banner>
        <Banner icon={<Megaphone strokeWidth={1.5} />} dismissible>
          Scheduled maintenance on Sunday from 2–4 AM. <Link href="#status">View status</Link>
        </Banner>
        <Banner variant="destructive" label="Billing issue" icon={<TriangleAlert strokeWidth={1.5} />} title="Payment failed." action={<Button size="sm" variant="secondary">Update card</Button>}>
          Update your card to keep your plan.
        </Banner>
      </div>
    </PrimitivePage>
  )
}
