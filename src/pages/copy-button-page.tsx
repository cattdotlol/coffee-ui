import { CopyButton, TextField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { CopyButton } from '@catpkgs/coffee-ui'

<CopyButton value="pnpm add @catpkgs/coffee-ui" />
<CopyButton value={apiKey} label="Copy API key" iconOnly />
<CopyButton value={() => window.location.href} label="Copy link" variant="outline" />`

export default function CopyButtonPage() {
  return (
    <PrimitivePage title="CopyButton" description="Copies text to the clipboard and confirms it with a checkmark and a screen reader announcement. Pass a string or a function that returns the value at click time." code={code}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton value="pnpm add @catpkgs/coffee-ui" />
          <CopyButton value={() => window.location.href} label="Copy link" variant="outline" />
        </div>
        <div className="flex max-w-sm items-end gap-1.5">
          <div className="flex-1"><TextField label="API key" readOnly value="sk_live_4eC39HqLyjWDarjtT1zdp7dc" /></div>
          <CopyButton value="sk_live_4eC39HqLyjWDarjtT1zdp7dc" label="Copy API key" iconOnly variant="outline" />
        </div>
      </div>
    </PrimitivePage>
  )
}
