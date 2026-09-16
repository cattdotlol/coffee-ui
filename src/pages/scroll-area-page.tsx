import { ScrollArea, Separator } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { ScrollArea } from '@catpkgs/coffee-ui'

<ScrollArea label="Release notes" className="h-60">
  {notes}
</ScrollArea>

<ScrollArea orientation="horizontal">…</ScrollArea>`

const tags = Array.from({ length: 40 }, (_, index) => `v0.${Math.floor(index / 10)}.${index % 10}`)

export default function ScrollAreaPage() {
  return (
    <PrimitivePage title="ScrollArea" description="A scroll container with a slim, theme-colored scrollbar. Add a label to make it a focusable region, so keyboard users can scroll it with the arrow keys." code={code}>
      <div className="grid gap-4 sm:grid-cols-2">
        <ScrollArea label="Tags" className="h-56 rounded-panel border border-border">
          <div className="p-3">
            <p className="mb-2 text-sm font-medium">Tags</p>
            {tags.map((tag, index) => (
              <div key={tag}>
                {index > 0 && <Separator className="my-1.5" />}
                <p className="text-sm">{tag}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <ScrollArea label="Swatches" orientation="horizontal" className="self-start rounded-panel border border-border">
          <div className="flex w-max gap-2 p-3">
            {Array.from({ length: 16 }, (_, index) => <div key={index} className="h-20 w-16 shrink-0 rounded-inner bg-subtle" />)}
          </div>
        </ScrollArea>
      </div>
    </PrimitivePage>
  )
}
