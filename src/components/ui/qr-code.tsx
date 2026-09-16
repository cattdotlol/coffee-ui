import { encode } from 'uqr'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'

export type QrCodeProps = Omit<ComponentProps<'div'>, 'children'> & {
  value: string
  label?: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  variant?: 'rounded' | 'dots' | 'square'
  color?: string
  background?: string
  quietZone?: number
  logo?: ReactNode
}

const POSITION = 2
const DATA = 0
const DOT_RADIUS = 0.45

function modulePath(x: number, y: number, dark: (x: number, y: number) => boolean) {
  const r = 0.5
  const top = dark(x, y - 1)
  const right = dark(x + 1, y)
  const bottom = dark(x, y + 1)
  const left = dark(x - 1, y)
  const tl = top || left ? 0 : r
  const tr = top || right ? 0 : r
  const br = bottom || right ? 0 : r
  const bl = bottom || left ? 0 : r
  const corner = (radius: number, toX: number, toY: number) => (radius ? `A${radius},${radius} 0 0 1 ${toX},${toY}` : `L${toX},${toY}`)
  return `M${x + tl},${y}H${x + 1 - tr}${corner(tr, x + 1, y + tr)}V${y + 1 - br}${corner(br, x + 1 - br, y + 1)}H${x + bl}${corner(bl, x, y + 1 - bl)}V${y + tl}${corner(tl, x + tl, y)}Z`
}

function roundedRect(x: number, y: number, size: number, radius: number) {
  return `M${x + radius},${y}H${x + size - radius}A${radius},${radius} 0 0 1 ${x + size},${y + radius}V${y + size - radius}A${radius},${radius} 0 0 1 ${x + size - radius},${y + size}H${x + radius}A${radius},${radius} 0 0 1 ${x},${y + size - radius}V${y + radius}A${radius},${radius} 0 0 1 ${x + radius},${y}Z`
}

// Scanners expect dark modules on a light field, so the defaults stay fixed instead of following the theme.
export default function QrCode({
  value, label, size = 160, level, variant = 'rounded', color = '#1a1411', background = '#ffffff', quietZone = 4, logo, className, style, ...props
}: QrCodeProps) {
  let qr: ReturnType<typeof encode> | null = null
  try {
    qr = encode(value, { ecc: level ?? (logo ? 'H' : 'M'), border: 0 })
  } catch {
    qr = null
  }

  if (!qr) {
    return (
      <div {...props} role="img" aria-label="QR code unavailable" style={{ width: size, height: size, ...style }} className={cn('flex items-center justify-center rounded-inner border border-dashed border-border p-3 text-center text-xs text-muted', className)}>
        Too much data for a QR code
      </div>
    )
  }

  const count = qr.size
  const total = count + quietZone * 2
  const logoSpan = logo ? Math.floor(count * 0.24) | 1 : 0
  const logoStart = (count - logoSpan) / 2
  const cleared = (x: number, y: number) => logo !== undefined && x >= logoStart - 1 && x < logoStart + logoSpan + 1 && y >= logoStart - 1 && y < logoStart + logoSpan + 1
  const dark = (x: number, y: number) => x >= 0 && y >= 0 && x < count && y < count && qr.data[y]![x]! && qr.types[y]![x] !== POSITION && !cleared(x, y)
  const finderRadius = variant === 'square' ? 0 : 1
  const finders = [[0, 0], [count - 7, 0], [0, count - 7]] as const

  let modules = ''
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (!dark(x, y)) continue
      if (variant === 'square') modules += `M${x},${y}h1v1h-1Z`
      // Timing, alignment, and format modules stay connected so readers can still lock onto the grid.
      else if (variant === 'dots' && qr.types[y]![x] === DATA) modules += `M${x + 0.5},${y + 0.5 - DOT_RADIUS}a${DOT_RADIUS},${DOT_RADIUS} 0 1 1 0,${DOT_RADIUS * 2}a${DOT_RADIUS},${DOT_RADIUS} 0 1 1 0,${-DOT_RADIUS * 2}Z`
      else modules += modulePath(x, y, dark)
    }
  }

  return (
    <div {...props} role="img" aria-label={label ?? `QR code for ${value}`} style={{ width: size, height: size, ...style }} className={cn('relative shrink-0', className)}>
      <svg aria-hidden="true" viewBox={`${-quietZone} ${-quietZone} ${total} ${total}`} width={size} height={size} shapeRendering={variant === 'square' ? 'crispEdges' : 'geometricPrecision'} className="block">
        <rect x={-quietZone} y={-quietZone} width={total} height={total} rx={variant === 'square' ? 0 : total * 0.08} fill={background} />
        <path d={modules} fill={color} />
        {finders.map(([x, y]) => (
          <g key={`${x}-${y}`} fill={color}>
            <path fillRule="evenodd" d={`${roundedRect(x, y, 7, finderRadius * 2.2)}${roundedRect(x + 1, y + 1, 5, finderRadius * 1.4)}`} />
            <path d={roundedRect(x + 2, y + 2, 3, finderRadius * 0.9)} />
          </g>
        ))}
      </svg>
      {logo && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[22%] [&>svg]:size-3/5"
          style={{ width: `${(logoSpan / total) * 100}%`, height: `${(logoSpan / total) * 100}%`, backgroundColor: background, color }}
        >
          {logo}
        </span>
      )}
    </div>
  )
}
