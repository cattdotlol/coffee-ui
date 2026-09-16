import { AspectRatio, SegmentedControl } from '@catpkgs/coffee-ui'
import { useState } from 'react'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { AspectRatio } from '@catpkgs/coffee-ui'

<AspectRatio ratio={16 / 9} className="rounded-panel">
  <img src="/cover.jpg" alt="Coffee beans" />
</AspectRatio>`

const ratios = { '16/9': 16 / 9, '4/3': 4 / 3, '1/1': 1 }

export default function AspectRatioPage() {
  const [ratio, setRatio] = useState<keyof typeof ratios>('16/9')
  return (
    <PrimitivePage title="AspectRatio" description="Keeps content at a fixed width-to-height ratio. Images, videos, and iframes inside fill the box, which prevents layout shift while media loads." code={code}>
      <div className="space-y-3">
        <SegmentedControl label="Ratio" value={ratio} onValueChange={setRatio} options={Object.keys(ratios).map((value) => ({ value: value as keyof typeof ratios, label: value }))} />
        <AspectRatio ratio={ratios[ratio]} className="max-w-sm rounded-panel bg-subtle">
          <div className="flex size-full items-center justify-center text-sm text-muted">{ratio}</div>
        </AspectRatio>
      </div>
    </PrimitivePage>
  )
}
