import { useState } from 'react'
import { Slider } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { Slider } from '@catpkgs/coffee-ui'

function Volume() {
  const [volume, setVolume] = useState(60)

  return (
    <Slider
      label="Volume"
      value={volume}
      onValueChange={setVolume}
      formatValue={(value) => \`\${value}%\`}
    />
  )
}

<Slider label="Font size" min={12} max={24} step={2} defaultValue={16} />
<Slider label="Locked" defaultValue={30} disabled />`

export default function SliderPage() {
  const [volume, setVolume] = useState(60)
  return (
    <PrimitivePage title="Slider" description="Select a number within a range. Built on the native range input, so arrow keys, Page Up/Down, Home, and End work out of the box. Use formatValue to give the value a readable unit." code={code}>
      <div className="max-w-sm space-y-5">
        <Slider label="Volume" value={volume} onValueChange={setVolume} formatValue={(value) => `${value}%`} />
        <Slider label="Font size" hint="Applies to the editor only." min={12} max={24} step={2} defaultValue={16} formatValue={(value) => `${value}px`} />
        <Slider label="Locked" defaultValue={30} disabled />
      </div>
    </PrimitivePage>
  )
}
