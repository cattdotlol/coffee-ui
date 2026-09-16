import { useState } from 'react'
import { ColorPicker } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { ColorPicker } from '@catpkgs/coffee-ui'

<ColorPicker
  label="Brand color"
  value={color}
  onValueChange={setColor}
  swatches={['#6f4e37', '#d4a373', '#a33a2c', '#3b2a20']}
/>`

export default function ColorPickerPage() {
  const [color, setColor] = useState('#6f4e37')
  return (
    <PrimitivePage title="ColorPicker" description="Choose a color with the system picker, type a hex value, or pick a preset swatch. Short hex values like #fff are expanded, and invalid input shows an error without losing the last valid color." code={code}>
      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="max-w-xs">
          <ColorPicker label="Brand color" value={color} onValueChange={setColor} swatches={['#6f4e37', '#d4a373', '#a33a2c', '#3b2a20', '#7a8b5c', '#4a6fa5']} />
        </div>
        <div aria-hidden="true" className="flex h-24 w-full items-center justify-center rounded-panel text-sm font-medium text-white sm:w-40" style={{ backgroundColor: color }}>Preview</div>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Current color: {color}</p>
    </PrimitivePage>
  )
}
