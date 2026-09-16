import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Link2, Undo2 } from 'lucide-react'
import { Button, IconButton, Separator, Toggle, Toolbar } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Bold, Italic } from 'lucide-react'
import { IconButton, Separator, Toggle, Toolbar } from '@catpkgs/coffee-ui'

<Toolbar label="Formatting">
  <Toggle aria-label="Bold"><Bold /></Toggle>
  <Toggle aria-label="Italic"><Italic /></Toggle>
  <Separator orientation="vertical" className="mx-1 h-5 self-center" />
  <IconButton aria-label="Undo"><Undo2 /></IconButton>
</Toolbar>`

export default function ToolbarPage() {
  return (
    <PrimitivePage title="Toolbar" description="Groups controls into a single tab stop. Tab enters and leaves the toolbar, while arrow keys, Home, and End move between its controls." code={code}>
      <Toolbar label="Formatting">
        <Toggle aria-label="Bold" className="ui-icon-button"><Bold aria-hidden="true" className="size-4" strokeWidth={1.5} /></Toggle>
        <Toggle aria-label="Italic" className="ui-icon-button"><Italic aria-hidden="true" className="size-4" strokeWidth={1.5} /></Toggle>
        <Separator orientation="vertical" className="mx-1 h-5 self-center" />
        <IconButton aria-label="Align left"><AlignLeft strokeWidth={1.5} /></IconButton>
        <IconButton aria-label="Align center"><AlignCenter strokeWidth={1.5} /></IconButton>
        <IconButton aria-label="Align right"><AlignRight strokeWidth={1.5} /></IconButton>
        <Separator orientation="vertical" className="mx-1 h-5 self-center" />
        <IconButton aria-label="Insert link"><Link2 strokeWidth={1.5} /></IconButton>
        <IconButton aria-label="Undo" disabled><Undo2 strokeWidth={1.5} /></IconButton>
        <Button size="sm" className="ml-1">Publish</Button>
      </Toolbar>
    </PrimitivePage>
  )
}
