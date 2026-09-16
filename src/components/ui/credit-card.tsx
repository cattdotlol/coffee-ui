import { useId } from 'react'
import type { ComponentProps } from 'react'
import { Nfc } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import CardBrandMark from './card-brand-mark.tsx'
import { cardBrandNames, cardNumberLength, detectCardBrand } from './credit-card-utils.ts'
import type { CardBrand } from './credit-card-utils.ts'

export type CreditCardProps = Omit<ComponentProps<'div'>, 'children'> & {
  number?: string
  name?: string
  expiry?: string
  cvc?: string
  brand?: CardBrand
  flipped?: boolean
  masked?: boolean
  theme?: 'espresso' | 'caramel' | 'midnight' | 'forest'
}

// Fixed dark gradients keep white text readable in both site themes.
const themes = {
  espresso: 'bg-[linear-gradient(135deg,#7a5640_0%,#3b2a20_55%,#1f150f_100%)]',
  caramel: 'bg-[linear-gradient(135deg,#9c5a2c_0%,#7a4222_55%,#4f2a15_100%)]',
  midnight: 'bg-[linear-gradient(135deg,#34405a_0%,#1d2433_55%,#10141d_100%)]',
  forest: 'bg-[linear-gradient(135deg,#4a6b45_0%,#2c4029_55%,#182317_100%)]',
}

function Chip() {
  const id = useId()
  return (
    <svg aria-hidden="true" viewBox="0 0 40 30" className="h-7 w-auto">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f3dca5" />
          <stop offset="1" stopColor="#c09a55" />
        </linearGradient>
      </defs>
      <rect width="40" height="30" rx="6" fill={`url(#${id})`} />
      <path d="M0 10h13m14 0h13M0 20h13m14 0h13M13 0v30m14-30v30M13 10q7 5 14 0M13 20q7-5 14 0" fill="none" stroke="#8a6a32" strokeOpacity={0.55} strokeWidth={1} />
    </svg>
  )
}

export default function CreditCard({
  number = '', name = '', expiry = '', cvc = '', brand: brandProp, flipped = false, masked = true, theme = 'espresso', className, ...props
}: CreditCardProps) {
  const brand = brandProp ?? detectCardBrand(number)
  const digits = number.replace(/\D/g, '')
  const length = cardNumberLength(brand)
  const groups = brand === 'amex' ? [4, 6, 5] : [4, 4, 4, 4]
  const shown = Array.from({ length }, (_, index) => {
    const digit = digits[index]
    if (!digit) return '•'
    return masked && index < length - 4 ? '•' : digit
  })
  const numberGroups = groups.map((size, index) => {
    const start = groups.slice(0, index).reduce((sum, item) => sum + item, 0)
    return shown.slice(start, start + size).join('')
  })
  const summary = `${cardBrandNames[brand]}${digits.length >= 4 ? ` ending in ${digits.slice(-4)}` : ''}${expiry ? `, expires ${expiry.replace(/\s/g, '')}` : ''}${name ? `, ${name}` : ''}`

  const face = cn('absolute inset-0 overflow-hidden rounded-panel text-white shadow-lg [backface-visibility:hidden]', themes[theme])
  const sheen = <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgb(255_255_255/0.22),transparent_45%)]" />

  return (
    <div {...props} role="img" aria-label={summary} className={cn('aspect-[1.586] w-full max-w-[22rem] [perspective:1000px]', className)}>
      <motion.div aria-hidden="true" initial={false} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="relative size-full [transform-style:preserve-3d]">
        <div className={cn(face, 'flex flex-col justify-between p-[6%] [container-type:inline-size]')}>
          {sheen}
          <div className="relative flex items-start justify-between">
            <span className="flex items-center gap-2"><Chip /><Nfc className="size-5 opacity-70" strokeWidth={1.5} /></span>
            <CardBrandMark brand={brand} className={cn(brand === 'unknown' && 'size-5 opacity-70', brand === 'visa' && 'text-lg', brand === 'mastercard' && 'h-6')} />
          </div>
          <p className="relative flex justify-between font-mono text-[clamp(0.95rem,4.8cqw,1.35rem)] tracking-[0.08em] text-white/95 tabular-nums">
            {numberGroups.map((group, index) => <span key={index}>{group}</span>)}
          </p>
          <div className="relative flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[0.5625rem] tracking-widest text-white/60 uppercase">Card holder</p>
              <p className="truncate text-sm font-medium tracking-wide uppercase">{name || 'Your name'}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[0.5625rem] tracking-widest text-white/60 uppercase">Expires</p>
              <p className="text-sm font-medium tabular-nums">{expiry.replace(/\s/g, '') || 'MM/YY'}</p>
            </div>
          </div>
        </div>
        <div className={cn(face, '[transform:rotateY(180deg)]')}>
          {sheen}
          <div className="absolute inset-x-0 top-[12%] h-[18%] bg-black/70" />
          <div className="absolute inset-x-[6%] top-[42%] flex h-[16%] items-center justify-end rounded-md bg-[repeating-linear-gradient(135deg,#f4ede4_0_6px,#e6dccf_6px_12px)] pr-3">
            <span className="rounded-sm bg-white px-2 py-0.5 font-mono text-sm text-[#1a1411] italic tabular-nums">{cvc || '•••'}</span>
          </div>
          <p className="absolute top-[62%] left-[6%] text-[0.5625rem] tracking-widest text-white/60 uppercase">Security code</p>
          <CardBrandMark brand={brand} className={cn('absolute right-[6%] bottom-[8%]', brand === 'visa' && 'text-lg', brand === 'mastercard' && 'h-6', brand === 'unknown' && 'size-5 opacity-70')} />
        </div>
      </motion.div>
    </div>
  )
}
