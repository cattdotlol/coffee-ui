import { useState } from 'react'
import { Settings2 } from 'lucide-react'
import { Button, Checkbox, IconButton, Popover } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Settings2 } from 'lucide-react'
import { Button, Checkbox, IconButton, Popover } from '@catpkgs/coffee-ui'

// A string trigger renders an outline button.
<Popover trigger="Filters" title="Display options">
  {({ close }) => (
    <>
      <Checkbox label="Include archived" onCheckedChange={setArchived} />
      <Button onClick={close}>Done</Button>
    </>
  )}
</Popover>

// Or pass any button element.
<Popover
  trigger={<IconButton aria-label="Settings"><Settings2 /></IconButton>}
  title="Settings"
  align="end"
>
  <p>Anything can go here.</p>
</Popover>`

export default function PopoverPage() {
  const [archived, setArchived] = useState(false)
  const [favorites, setFavorites] = useState(false)
  return (
    <PrimitivePage title="Popover" description="A non-modal panel for quick settings and filters. Pass a string or any button element as the trigger. Tab moves into its controls; Escape or an outside click dismisses it." code={code}>
      <div className="flex flex-wrap items-center gap-2">
        <Popover trigger="Filters" title="Display options" description="Choose what appears in your list.">
          {({ close }) => (
            <div className="space-y-1">
              <Checkbox label="Include archived" checked={archived} onCheckedChange={setArchived} />
              <Checkbox label="Favorites only" checked={favorites} onCheckedChange={setFavorites} />
              <div className="flex justify-end pt-2"><Button onClick={close}>Done</Button></div>
            </div>
          )}
        </Popover>
        <Popover trigger={<IconButton aria-label="Settings"><Settings2 strokeWidth={1.5} /></IconButton>} title="Settings" align="end">
          <p className="text-sm text-muted">Any element with a button role works as a trigger.</p>
        </Popover>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Archived: {archived ? 'included' : 'hidden'}. Favorites: {favorites ? 'only' : 'all items'}.</p>
    </PrimitivePage>
  )
}
