import { useState } from 'react'
import { Ellipsis, MapPin, Pencil, Star, Trash2 } from 'lucide-react'
import {
  Avatar, Badge, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle,
  DropdownMenu, IconButton, Progress, SegmentedControl, TextField,
} from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, CardAction } from '@catpkgs/coffee-ui'

// Shorthand props cover most cards.
<Card
  title="Workspace"
  description="Update how your workspace appears."
  action={<IconButton aria-label="More"><Ellipsis /></IconButton>}
  footer={<Button>Save</Button>}
>
  <TextField label="Name" />
</Card>

// Compose the parts for custom layouts.
<Card variant="elevated" size="lg">
  <CardMedia ratio={16 / 9}><img src="/beans.jpg" alt="" /></CardMedia>
  <CardHeader>
    <CardTitle href="/products/ethiopia">Ethiopia Yirgacheffe</CardTitle>
    <CardDescription>Floral, citrus, and bergamot.</CardDescription>
    <CardAction><Badge>New</Badge></CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter align="between">…</CardFooter>
</Card>`

export default function CardPage() {
  const [name, setName] = useState('Coffee')
  const [saved, setSaved] = useState('Coffee')
  const [variant, setVariant] = useState<'default' | 'elevated' | 'outline' | 'subtle'>('default')
  return (
    <PrimitivePage title="Card" description="A container for related content and actions. Use the shorthand props for common layouts, or compose CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, and CardMedia. Pass href to make the whole card a link while buttons inside stay clickable." code={code}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            title="Workspace"
            description="Update how your workspace appears to others."
            action={<DropdownMenu align="end" trigger={<IconButton aria-label="Workspace actions" size="sm"><Ellipsis strokeWidth={1.5} /></IconButton>} items={[
              { label: 'Rename', icon: <Pencil strokeWidth={1.5} /> },
              { label: 'Delete', icon: <Trash2 strokeWidth={1.5} />, destructive: true, separatorBefore: true },
            ]} />}
            footer={<>
              <Button variant="secondary" disabled={name === saved} onClick={() => setName(saved)}>Cancel</Button>
              <Button disabled={!name.trim() || name === saved} onClick={() => setSaved(name.trim())}>Save</Button>
            </>}
          >
            <TextField label="Workspace name" value={name} onValueChange={setName} />
          </Card>

          <Card variant="elevated" as="article">
            <CardMedia ratio={16 / 7}>
              <div className="size-full bg-[radial-gradient(circle_at_30%_40%,#c9a27e,#6f4e37_55%,#3b2a20)]" />
              <Badge variant="default" className="absolute top-3 left-3">New roast</Badge>
            </CardMedia>
            <CardHeader>
              <CardTitle href="#ethiopia">Ethiopia Yirgacheffe</CardTitle>
              <CardDescription>Floral and citrus with a bergamot finish.</CardDescription>
              <CardAction><IconButton aria-label="Save to favorites" size="sm"><Star strokeWidth={1.5} /></IconButton></CardAction>
            </CardHeader>
            <CardFooter align="between" divider={false}>
              <span className="text-lg font-semibold">$18</span>
              <Button size="sm" variant="outline">Add to cart</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-3">
          <SegmentedControl label="Variant" value={variant} onValueChange={setVariant} options={[
            { value: 'default', label: 'Default' },
            { value: 'elevated', label: 'Elevated' },
            { value: 'outline', label: 'Outline' },
            { value: 'subtle', label: 'Subtle' },
          ]} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Card variant={variant} size="sm">
              <CardHeader>
                <CardDescription className="mt-0">Monthly goal</CardDescription>
                <CardTitle className="text-2xl">$18.4K</CardTitle>
              </CardHeader>
              <CardContent><Progress label="Monthly goal" hideLabel value={74} /></CardContent>
            </Card>
            <Card variant={variant} size="sm" href="#downtown" title="Downtown" description="12 Market Street">
              <p className="flex items-center gap-1.5 text-xs text-muted"><MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Open until 6 PM</p>
            </Card>
            <Card variant={variant} size="sm">
              <CardContent className="flex items-center gap-3">
                <Avatar alt="Grace Hopper" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Grace Hopper</p>
                  <p className="truncate text-xs text-muted">Head roaster</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrimitivePage>
  )
}
