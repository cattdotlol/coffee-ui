import { useRef, useState } from 'react'
import { Coffee, Download } from 'lucide-react'
import { Button, CopyButton, QrCode, SegmentedControl, Slider, Switch, TextField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Coffee } from 'lucide-react'
import { QrCode } from '@catpkgs/coffee-ui'

<QrCode value="https://coffee.dev/menu" />

// Add a logo in the middle; error correction is raised automatically.
<QrCode
  value="https://coffee.dev/menu"
  label="Scan to view our menu"
  size={200}
  variant="dots" // "rounded" | "dots" | "square"
  logo={<Coffee />}
/>`

export default function QrCodePage() {
  const previewRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('https://coffee.dev/menu')
  const [variant, setVariant] = useState<'rounded' | 'dots' | 'square'>('rounded')
  const [size, setSize] = useState(184)
  const [logo, setLogo] = useState(true)

  function download() {
    const svg = previewRef.current?.querySelector('svg')
    if (!svg) return
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'qr-code.svg'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PrimitivePage title="QrCode" description="Generates a scannable QR code as crisp SVG, with rounded, dot, or square modules and an optional center logo. Modules stay dark on a light field in both themes, because many scanners can't read inverted codes. Give it a label that says what scanning does." code={code}>
      <div className="grid items-start gap-6 md:grid-cols-[auto_1fr]">
        <div ref={previewRef} className="flex justify-center rounded-panel bg-subtle p-4">
          <QrCode value={value} size={size} variant={variant} logo={logo ? <Coffee strokeWidth={2} /> : undefined} label="Scan to open the menu" />
        </div>
        <div className="space-y-4">
          <div className="flex items-end gap-1.5">
            <div className="flex-1"><TextField label="Content" value={value} onValueChange={setValue} /></div>
            <CopyButton value={value} label="Copy content" iconOnly variant="outline" />
          </div>
          <SegmentedControl label="Module style" value={variant} onValueChange={setVariant} options={[{ value: 'rounded', label: 'Rounded' }, { value: 'dots', label: 'Dots' }, { value: 'square', label: 'Square' }]} />
          <Slider label="Size" min={96} max={240} step={8} value={size} onValueChange={setSize} formatValue={(item) => `${item}px`} />
          <Switch label="Center logo" hint="Uses high error correction so the code still scans." checked={logo} onCheckedChange={setLogo} />
          <Button variant="outline" size="sm" onClick={download}><Download aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Download SVG</Button>
        </div>
      </div>
    </PrimitivePage>
  )
}
