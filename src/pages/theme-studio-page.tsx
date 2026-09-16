import { useEffect, useId, useState } from 'react'
import { motion } from 'motion/react'
import { Bell, Download, Ellipsis, Pencil, RotateCcw, Sparkles, Trash2 } from 'lucide-react'
import {
  Alert, AvatarGroup, Badge, BarChart, Button, Calendar, Card, Checkbox, CodeBlock, DropdownMenu, IconButton, Pagination, Progress,
  RadioGroup, SegmentedControl, Select, Slider, Switch, Table, Tabs, Tag, TextField, Timeline, ToggleGroup, useToast,
} from '@catpkgs/coffee-ui'
import type { TableColumn } from '@catpkgs/coffee-ui'
import { PILL, applyTheme, clearTheme, contrast, defaultTheme, fonts, loadTheme, presets, saveTheme, themeToExportCss } from '../theme-studio/theme.ts'
import type { ColorToken, Palette, Theme } from '../theme-studio/theme.ts'

type Mode = 'light' | 'dark'

const groups: { label: string; tokens: (ColorToken | 'shadow')[] }[] = [
  { label: 'Surfaces', tokens: ['background', 'surface', 'subtle', 'border'] },
  { label: 'Text', tokens: ['foreground', 'muted'] },
  { label: 'Brand', tokens: ['primary', 'primary-hover', 'primary-soft', 'on-primary'] },
  { label: 'Danger', tokens: ['danger', 'destructive', 'destructive-hover', 'on-destructive'] },
  { label: 'Charts', tokens: ['chart-1', 'chart-2', 'chart-3', 'chart-4'] },
  { label: 'Depth', tokens: ['shadow'] },
]

const checks: { label: string; text: ColorToken; background: ColorToken }[] = [
  { label: 'Text on background', text: 'foreground', background: 'background' },
  { label: 'Muted on surface', text: 'muted', background: 'surface' },
  { label: 'Muted on subtle', text: 'muted', background: 'subtle' },
  { label: 'On primary', text: 'on-primary', background: 'primary' },
  { label: 'Primary on soft', text: 'primary', background: 'primary-soft' },
  { label: 'Danger on surface', text: 'danger', background: 'surface' },
  { label: 'On destructive', text: 'on-destructive', background: 'destructive' },
]

const labelFor = (token: string) => token.replace('-', ' ').replace(/^\w/, (letter) => letter.toUpperCase())
const isHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value)

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <div className="flex items-center gap-2">
      <input type="color" aria-label={`${label} color picker`} value={value} onChange={(event) => { setDraft(null); onChange(event.target.value) }} className="ui-color-input size-7 pointer-coarse:size-9" />
      <label htmlFor={id} className="min-w-0 flex-1 truncate text-xs">{label}</label>
      <input
        id={id}
        value={draft ?? value}
        maxLength={7}
        spellCheck={false}
        autoComplete="off"
        aria-invalid={draft !== null && !isHex(draft) ? true : undefined}
        onChange={(event) => {
          const next = event.target.value.startsWith('#') ? event.target.value : `#${event.target.value}`
          setDraft(next)
          if (isHex(next)) onChange(next.toLowerCase())
        }}
        onBlur={() => setDraft(null)}
        className="ui-text-field min-h-7 w-[5.5rem] px-2 py-0.5 font-mono text-xs uppercase"
      />
    </div>
  )
}

function Contrast({ palette }: { palette: Palette }) {
  return (
    <ul className="space-y-1.5">
      {checks.map((check) => {
        const ratio = contrast(palette[check.text], palette[check.background])
        return (
          <li key={check.label} className="flex items-center gap-2 text-xs">
            <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full border border-black/10 text-[0.625rem] font-semibold" style={{ backgroundColor: palette[check.background], color: palette[check.text] }}>A</span>
            <span className="min-w-0 flex-1 truncate">{check.label}</span>
            <Badge variant={ratio >= 4.5 ? 'secondary' : 'destructive'} dot={ratio >= 4.5}>{ratio >= 4.5 ? 'AA' : 'Fails'} {ratio.toFixed(1)}</Badge>
          </li>
        )
      })}
    </ul>
  )
}

type Invoice = { id: string; customer: string; status: string; amount: number }

const invoices: Invoice[] = [
  { id: 'INV-1042', customer: 'Northwind', status: 'Paid', amount: 1250 },
  { id: 'INV-1043', customer: 'Globex', status: 'Pending', amount: 320.5 },
  { id: 'INV-1044', customer: 'Initech', status: 'Failed', amount: 89.99 },
]

const columns: TableColumn<Invoice>[] = [
  { key: 'id', header: 'Invoice', cell: (row) => <span className="font-medium">{row.id}</span>, sortValue: (row) => row.id },
  { key: 'status', header: 'Status', cell: (row) => <Badge variant={row.status === 'Paid' ? 'default' : row.status === 'Failed' ? 'destructive' : 'secondary'}>{row.status}</Badge> },
  { key: 'amount', header: 'Amount', align: 'end', cell: (row) => `$${row.amount.toFixed(2)}`, sortValue: (row) => row.amount },
]

function Preview({ mode, onModeChange }: { mode: Mode; onModeChange: (mode: Mode) => void }) {
  const { toast } = useToast()
  const [progress, setProgress] = useState(64)
  const [page, setPage] = useState(2)
  return (
    <section aria-label="Theme preview" data-theme={mode} className="space-y-4 rounded-panel border border-border bg-background p-4 text-foreground sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold">Preview</p>
        <SegmentedControl label="Preview mode" value={mode} onValueChange={onModeChange} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => toast({ title: 'Theme looks great', variant: 'success' })}>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive"><Trash2 aria-hidden="true" className="size-4" strokeWidth={1.5} />Delete</Button>
        <Button variant="link">Link</Button>
        <IconButton aria-label="Notifications" variant="outline"><Bell strokeWidth={1.5} /></IconButton>
        <DropdownMenu trigger={<IconButton aria-label="More actions"><Ellipsis strokeWidth={1.5} /></IconButton>} items={[
          { label: 'Edit', icon: <Pencil strokeWidth={1.5} />, shortcut: '⌘E' },
          { label: 'Delete', icon: <Trash2 strokeWidth={1.5} />, destructive: true, separatorBefore: true },
        ]} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Account" description="Update your workspace details." footer={<><Button variant="secondary" size="sm">Cancel</Button><Button size="sm">Save</Button></>}>
          <div className="space-y-3">
            <TextField label="Display name" defaultValue="Ada Lovelace" />
            <Select label="Role" options={[{ value: 'owner', label: 'Owner' }, { value: 'editor', label: 'Editor' }]} />
            <Switch label="Email notifications" defaultChecked />
            <Checkbox label="Share usage data" hint="Helps us improve Coffee UI." />
          </div>
        </Card>
        <div className="space-y-4">
          <Alert title="Heads up" icon={<Sparkles strokeWidth={1.5} />}>Every value on this page is a design token.</Alert>
          <Progress label="Storage" value={progress} />
          <Slider label="Progress" value={progress} onValueChange={setProgress} formatValue={(value) => `${value}%`} />
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="default">Default</Badge>
            <Badge dot>Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Error</Badge>
            <Tag onRemove={() => {}}>Removable</Tag>
          </div>
          <div className="flex items-center justify-between gap-3">
            <AvatarGroup label="Team" avatars={[{ alt: 'Ada Lovelace' }, { alt: 'Grace Hopper' }, { alt: 'Alan Turing' }, { alt: 'Linus Torvalds' }]} max={3} size="sm" />
            <ToggleGroup label="Format" defaultValue={['bold']} items={[{ value: 'bold', label: 'B' }, { value: 'italic', label: 'I' }]} />
          </div>
          <RadioGroup label="Plan" orientation="horizontal" defaultValue="pro" options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]} />
        </div>
      </div>

      <Tabs label="Preview sections" items={[
        { value: 'invoices', label: 'Invoices', content: <Table caption="Invoices" columns={columns} rows={invoices} getRowKey={(row) => row.id} selectable /> },
        { value: 'activity', label: 'Activity', content: <Timeline items={[
          { title: 'Theme updated', time: 'Just now', active: true },
          { title: 'Preset applied', time: '2m ago', description: 'Switched to a new palette.' },
        ]} /> },
        { value: 'disabled', label: 'Disabled', disabled: true, content: null },
      ]} />

      <div className="rounded-panel border border-border bg-surface p-4">
        <p className="mb-3 text-sm font-semibold">Orders by channel</p>
        <BarChart label="Orders by channel" layout="stacked" index="day" height={180} data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => ({ day, store: 120 + index * 12, app: 70 + index * 8, delivery: 40 + (index % 3) * 14, catering: 12 + (index % 2) * 10 }))} series={[{ key: 'store', label: 'In store' }, { key: 'app', label: 'App' }, { key: 'delivery', label: 'Delivery' }, { key: 'catering', label: 'Catering' }]} />
      </div>

      <div className="grid items-start gap-4 md:grid-cols-[auto_1fr]">
        <div className="rounded-panel border border-border bg-surface p-3"><Calendar defaultValue={new Date()} /></div>
        <div className="space-y-3">
          <Pagination page={page} pageCount={8} onPageChange={setPage} />
          <p className="text-sm leading-5 text-muted">Body copy uses the muted token for supporting text and <a href="#preview" className="font-medium text-foreground underline decoration-border underline-offset-4">links</a> stay readable in both modes.</p>
        </div>
      </div>
    </section>
  )
}

export default function ThemeStudioPage() {
  const [theme, setTheme] = useState<Theme>(() => loadTheme() ?? defaultTheme)
  const [mode, setMode] = useState<Mode>(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'))
  const css = themeToExportCss(theme)
  const palette = theme[mode]
  const activePreset = presets.find((preset) => JSON.stringify(preset.theme) === JSON.stringify(theme))?.name

  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
  }, [theme])

  function update<K extends keyof Theme>(key: K, value: Theme[K]) {
    setTheme({ ...theme, [key]: value })
  }

  function updateColor(token: ColorToken | 'shadow', value: string) {
    setTheme({ ...theme, [mode]: { ...palette, [token]: value } })
  }

  function reset() {
    clearTheme()
    setTheme(defaultTheme)
  }

  function download() {
    const url = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'coffee-ui-theme.css'
    link.click()
    URL.revokeObjectURL(url)
  }

  const colors = (
    <div className="space-y-4">
      <SegmentedControl label="Palette to edit" value={mode} onValueChange={setMode} options={[{ value: 'light', label: 'Light palette' }, { value: 'dark', label: 'Dark palette' }]} className="w-full [&>button]:flex-1" />
      {groups.map((group) => (
        <fieldset key={group.label} className="space-y-1.5">
          <legend className="mb-1.5 text-xs font-medium text-muted">{group.label}</legend>
          {group.tokens.map((token) => <ColorRow key={`${mode}-${token}`} label={token === 'shadow' ? 'Shadow tint' : labelFor(token)} value={palette[token]} onChange={(value) => updateColor(token, value)} />)}
        </fieldset>
      ))}
      <div>
        <p className="mb-1.5 text-xs font-medium text-muted">Contrast ({mode})</p>
        <Contrast palette={palette} />
      </div>
    </div>
  )

  const shape = (
    <div className="space-y-4">
      <Switch label="Pill-shaped controls" checked={theme.radiusControl >= PILL} onCheckedChange={(checked) => update('radiusControl', checked ? PILL : 8)} />
      <Slider label="Control radius" min={0} max={20} disabled={theme.radiusControl >= PILL} value={Math.min(theme.radiusControl, 20)} onValueChange={(value) => update('radiusControl', value)} formatValue={(value) => (theme.radiusControl >= PILL ? 'Pill' : `${value}px`)} />
      <Slider label="Inner radius" hint="Textareas, tooltips, and multi-line fields." min={0} max={24} value={theme.radiusInner} onValueChange={(value) => update('radiusInner', value)} formatValue={(value) => `${value}px`} />
      <Slider label="Panel radius" hint="Cards, dialogs, and popovers." min={0} max={32} value={theme.radiusPanel} onValueChange={(value) => update('radiusPanel', value)} formatValue={(value) => `${value}px`} />
      <Slider label="Density" hint={`Buttons are ${Math.round(theme.spacing * 9)}px tall.`} min={2.8} max={4.4} step={0.04} value={theme.spacing} onValueChange={(value) => update('spacing', value)} formatValue={(value) => `${value.toFixed(2)}px`} />
    </div>
  )

  const type = (
    <div className="space-y-4">
      <Select label="Font family" value={theme.font} onValueChange={(value) => update('font', value)} options={fonts} />
      <Slider label="Small text" hint="Hints, badges, and captions." min={10} max={14} step={0.5} value={theme.textXs} onValueChange={(value) => update('textXs', value)} formatValue={(value) => `${value}px`} />
      <Slider label="Body text" hint="Controls and most copy." min={12} max={17} step={0.5} value={theme.textSm} onValueChange={(value) => update('textSm', value)} formatValue={(value) => `${value}px`} />
      <Slider label="Large text" hint="Dialog and card titles." min={13} max={20} step={0.5} value={theme.textBase} onValueChange={(value) => update('textBase', value)} formatValue={(value) => `${value}px`} />
    </div>
  )

  const exportPanel = (
    <div className="space-y-3">
      <p className="text-xs leading-5 text-muted">Paste this into your stylesheet after <code className="font-mono">@import "tailwindcss"</code>. It replaces the default tokens.</p>
      <CodeBlock code={css} filename="theme.css" className="[&_pre]:max-h-80 [&_pre]:overflow-y-auto" />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={download}><Download aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Download CSS</Button>
        <Button size="sm" variant="secondary" onClick={reset}><RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Reset</Button>
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-5xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">Tools</p>
          <h1 className="text-2xl font-semibold tracking-tight">Theme studio</h1>
          <p className="mt-2 max-w-xl text-sm leading-5 text-muted">Adjust every design token and watch the components update. Changes apply across this site and are saved in your browser.</p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}><RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Reset to Coffee</Button>
      </header>

      <div role="group" aria-label="Presets" className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            aria-pressed={activePreset === preset.name}
            onClick={() => setTheme(preset.theme)}
            className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-control border border-border bg-surface py-1 pr-3 pl-1.5 text-sm font-medium shadow-xs hover:bg-subtle aria-pressed:border-primary aria-pressed:bg-primary-soft motion-safe:transition-colors pointer-coarse:min-h-11"
          >
            <span aria-hidden="true" className="flex -space-x-1.5">
              {[preset.theme[mode].background, preset.theme[mode].primary, preset.theme[mode]['primary-soft']].map((color, index) => (
                <span key={index} className="size-5 rounded-full border-2 border-surface" style={{ backgroundColor: color }} />
              ))}
            </span>
            {preset.name}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[17rem_1fr]">
        <aside aria-label="Theme controls" className="ui-scroll-area rounded-panel border border-border bg-surface p-4 shadow-xs lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:overflow-y-auto">
          <Tabs label="Theme settings" items={[
            { value: 'colors', label: 'Colors', content: colors },
            { value: 'shape', label: 'Shape', content: shape },
            { value: 'type', label: 'Type', content: type },
            { value: 'export', label: 'Export', content: exportPanel },
          ]} />
        </aside>
        <Preview mode={mode} onModeChange={setMode} />
      </div>
    </motion.div>
  )
}
