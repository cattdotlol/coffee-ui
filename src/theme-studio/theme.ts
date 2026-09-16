export const colorTokens = [
  'background', 'surface', 'subtle', 'border', 'foreground', 'muted',
  'primary', 'primary-hover', 'primary-soft', 'on-primary',
  'danger', 'destructive', 'destructive-hover', 'on-destructive', 'chart-1', 'chart-2', 'chart-3', 'chart-4',
] as const

export type ColorToken = (typeof colorTokens)[number]
export type Palette = Record<ColorToken, string> & { shadow: string }

export type Theme = {
  light: Palette
  dark: Palette
  font: string
  spacing: number
  textXs: number
  textSm: number
  textBase: number
  radiusControl: number
  radiusInner: number
  radiusPanel: number
}

export const fonts = [
  { value: '"DM Sans Variable", ui-sans-serif, system-ui, sans-serif', label: 'DM Sans' },
  { value: 'ui-sans-serif, system-ui, sans-serif', label: 'System' },
  { value: 'ui-serif, Georgia, Cambria, serif', label: 'Serif' },
  { value: 'ui-monospace, SFMono-Regular, Menlo, monospace', label: 'Monospace' },
]

export const PILL = 9999

const coffee: Theme = {
  light: {
    background: '#f3ece4', surface: '#fbf7f2', subtle: '#eadfd3', border: '#d9c8b6', foreground: '#3b2a20', muted: '#6e5747',
    primary: '#6f4e37', 'primary-hover': '#5c3f2c', 'primary-soft': '#e3d3c2', 'on-primary': '#fff8f0',
    danger: '#a33a2c', destructive: '#b0402f', 'destructive-hover': '#933325', 'on-destructive': '#fff8f0', 'chart-1': '#a8582a', 'chart-2': '#3f74b8', 'chart-3': '#4f8a3c', 'chart-4': '#8a52a8', shadow: '#3b2a20',
  },
  dark: {
    background: '#1a1411', surface: '#231b16', subtle: '#2c221c', border: '#45362c', foreground: '#eee3d8', muted: '#b5a291',
    primary: '#d4a373', 'primary-hover': '#e0b88e', 'primary-soft': '#3e2f24', 'on-primary': '#1f160f',
    danger: '#f0a898', destructive: '#e89a8a', 'destructive-hover': '#f0b2a5', 'on-destructive': '#3a1510', 'chart-1': '#c97a3f', 'chart-2': '#5b93dd', 'chart-3': '#6fa65a', 'chart-4': '#a877c9', shadow: '#000000',
  },
  font: fonts[0]!.value,
  spacing: 3.36,
  textXs: 11,
  textSm: 13,
  textBase: 15,
  radiusControl: PILL,
  radiusInner: 14,
  radiusPanel: 20,
}

export const defaultTheme = coffee

export const presets: { name: string; theme: Theme }[] = [
  { name: 'Coffee', theme: coffee },
  {
    name: 'Matcha',
    theme: {
      ...coffee,
      light: {
        background: '#eef1e8', surface: '#f8faf4', subtle: '#e2e8d8', border: '#c9d3b9', foreground: '#26301f', muted: '#56624b',
        primary: '#4f6b3a', 'primary-hover': '#3f5a2c', 'primary-soft': '#d8e3c8', 'on-primary': '#f8fbf3',
        danger: '#a33a2c', destructive: '#b0402f', 'destructive-hover': '#933325', 'on-destructive': '#fff8f0', 'chart-1': '#4f7a2e', 'chart-2': '#3f74b8', 'chart-3': '#a8582a', 'chart-4': '#8a52a8', shadow: '#26301f',
      },
      dark: {
        background: '#131711', surface: '#1a2017', subtle: '#20271c', border: '#364131', foreground: '#e3eadb', muted: '#a7b39b',
        primary: '#a8c686', 'primary-hover': '#bdd6a0', 'primary-soft': '#2c3a24', 'on-primary': '#141b0f',
        danger: '#f0a898', destructive: '#e89a8a', 'destructive-hover': '#f0b2a5', 'on-destructive': '#3a1510', 'chart-1': '#6f9a42', 'chart-2': '#5b93dd', 'chart-3': '#c97a3f', 'chart-4': '#a877c9', shadow: '#000000',
      },
    },
  },
  {
    name: 'Blueberry',
    theme: {
      ...coffee,
      radiusInner: 12,
      radiusPanel: 18,
      light: {
        background: '#eceff5', surface: '#f7f8fb', subtle: '#e0e5ef', border: '#c6cee0', foreground: '#1f2a44', muted: '#4f5b76',
        primary: '#3451c7', 'primary-hover': '#2a43ab', 'primary-soft': '#dbe3fb', 'on-primary': '#ffffff',
        danger: '#b3261e', destructive: '#c5302a', 'destructive-hover': '#a32620', 'on-destructive': '#ffffff', 'chart-1': '#3a5fd0', 'chart-2': '#a8582a', 'chart-3': '#8a52a8', 'chart-4': '#4f8a3c', shadow: '#1f2a44',
      },
      dark: {
        background: '#10131c', surface: '#171b27', subtle: '#1d2231', border: '#323a52', foreground: '#e2e7f3', muted: '#a2abc4',
        primary: '#8ea5ff', 'primary-hover': '#a8b9ff', 'primary-soft': '#26305a', 'on-primary': '#0f1530',
        danger: '#ffb4ab', destructive: '#ff9f94', 'destructive-hover': '#ffb8b0', 'on-destructive': '#410e0b', 'chart-1': '#6f8ff0', 'chart-2': '#c97a3f', 'chart-3': '#a877c9', 'chart-4': '#6fa65a', shadow: '#000000',
      },
    },
  },
  {
    name: 'Rose',
    theme: {
      ...coffee,
      light: {
        background: '#f6eef0', surface: '#fcf7f8', subtle: '#efe1e5', border: '#e0c9cf', foreground: '#3d2229', muted: '#74525b',
        primary: '#963a5e', 'primary-hover': '#7f2f4f', 'primary-soft': '#f2d9e2', 'on-primary': '#fff7fa',
        danger: '#a33a2c', destructive: '#b0402f', 'destructive-hover': '#933325', 'on-destructive': '#fff8f0', 'chart-1': '#b0406a', 'chart-2': '#3f74b8', 'chart-3': '#4f8a3c', 'chart-4': '#6a4fc0', shadow: '#3d2229',
      },
      dark: {
        background: '#1a1215', surface: '#22181c', subtle: '#2b1f24', border: '#46333a', foreground: '#f1e2e7', muted: '#bfa3ac',
        primary: '#e79ab8', 'primary-hover': '#f0b3cb', 'primary-soft': '#43283a', 'on-primary': '#2a0f1c',
        danger: '#f0a898', destructive: '#e89a8a', 'destructive-hover': '#f0b2a5', 'on-destructive': '#3a1510', 'chart-1': '#d0628c', 'chart-2': '#5b93dd', 'chart-3': '#6fa65a', 'chart-4': '#937ddf', shadow: '#000000',
      },
    },
  },
  {
    name: 'Charcoal',
    theme: {
      light: {
        background: '#ebebeb', surface: '#f3f3f3', subtle: '#e3e3e3', border: '#cecece', foreground: '#303030', muted: '#626262',
        primary: '#303030', 'primary-hover': '#454545', 'primary-soft': '#d9d9d9', 'on-primary': '#ffffff',
        danger: '#a33432', destructive: '#b42323', 'destructive-hover': '#961c1c', 'on-destructive': '#ffffff', 'chart-1': '#2a78d6', 'chart-2': '#c2521f', 'chart-3': '#14855d', 'chart-4': '#9a6a10', shadow: '#000000',
      },
      dark: {
        background: '#1c1c1c', surface: '#242424', subtle: '#212121', border: '#3b3b3b', foreground: '#dadada', muted: '#a6a6a6',
        primary: '#d4d4d4', 'primary-hover': '#e5e5e5', 'primary-soft': '#353535', 'on-primary': '#1c1c1c',
        danger: '#efaaa2', destructive: '#eaa19b', 'destructive-hover': '#f0b6b1', 'on-destructive': '#351413', 'chart-1': '#3987e5', 'chart-2': '#d95926', 'chart-3': '#199e70', 'chart-4': '#b58a1f', shadow: '#000000',
      },
      font: coffee.font,
      spacing: 4,
      textXs: 12,
      textSm: 14,
      textBase: 16,
      radiusControl: 6,
      radiusInner: 8,
      radiusPanel: 12,
    },
  },
]

const storageKey = 'coffee-ui-theme'
const rem = (px: number) => `${Number((px / 16).toFixed(4))}rem`
const rgbChannels = (hex: string) => [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16)).join(' ')

function paletteVars(palette: Palette) {
  return [
    ...colorTokens.map((token) => `--color-${token}: ${palette[token]};`),
    `--shadow-color: ${rgbChannels(palette.shadow)};`,
  ]
}

function sharedVars(theme: Theme) {
  return [
    `--font-sans: ${theme.font};`,
    `--spacing: ${rem(theme.spacing)};`,
    `--text-xs: ${rem(theme.textXs)};`,
    `--text-sm: ${rem(theme.textSm)};`,
    `--text-base: ${rem(theme.textBase)};`,
    `--radius-control: ${theme.radiusControl >= PILL ? '9999px' : rem(theme.radiusControl)};`,
    `--radius-inner: ${rem(theme.radiusInner)};`,
    `--radius-panel: ${rem(theme.radiusPanel)};`,
  ]
}

const block = (selector: string, lines: string[]) => `${selector} {\n${lines.map((line) => `  ${line}`).join('\n')}\n}`

// Scoped [data-theme] blocks let a preview show light or dark regardless of the site mode.
export function themeToRuntimeCss(theme: Theme) {
  return [
    block(':root', sharedVars(theme)),
    block(':root, [data-theme="light"]', ['color-scheme: light;', ...paletteVars(theme.light)]),
    block(':root[data-theme="dark"], [data-theme="dark"]', ['color-scheme: dark;', ...paletteVars(theme.dark)]),
  ].join('\n\n')
}

export function themeToExportCss(theme: Theme) {
  return [
    block('@theme', [...sharedVars(theme), ...paletteVars(theme.light)]),
    block(':root[data-theme="dark"]', paletteVars(theme.dark)),
  ].join('\n\n') + '\n'
}

export function applyTheme(theme: Theme) {
  let style = document.getElementById(storageKey) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = storageKey
    document.head.append(style)
  }
  style.textContent = themeToRuntimeCss(theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content', document.documentElement.dataset.theme === 'dark' ? theme.dark.background : theme.light.background,
  )
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(theme))
  } catch {
    return
  }
}

export function loadTheme(): Theme | null {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null') as Partial<Theme> | null
    if (!saved) return null
    return {
      ...defaultTheme,
      ...saved,
      light: { ...defaultTheme.light, ...saved.light },
      dark: { ...defaultTheme.dark, ...saved.dark },
    }
  } catch {
    return null
  }
}

export function clearTheme() {
  try {
    localStorage.removeItem(storageKey)
  } catch {
    // Storage can be unavailable in private modes; the in-memory reset still applies.
  }
  document.getElementById(storageKey)?.remove()
}

function luminance(hex: string) {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((index) => {
    const channel = parseInt(hex.slice(index, index + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (high + 0.05) / (low + 0.05)
}
