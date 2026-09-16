import { CreditCard as CardIcon } from 'lucide-react'
import { cn } from './cn.ts'
import type { CardBrand } from './credit-card-utils.ts'

// Simplified wordmarks, not official logos.
export default function CardBrandMark({ brand, className }: { brand: CardBrand; className?: string }) {
  if (brand === 'mastercard') {
    return (
      <svg aria-hidden="true" viewBox="0 0 38 24" className={cn('h-4 w-auto', className)}>
        <circle cx="14" cy="12" r="9" fill="#eb001b" />
        <circle cx="24" cy="12" r="9" fill="#f79e1b" fillOpacity={0.9} />
      </svg>
    )
  }
  if (brand === 'visa') return <span aria-hidden="true" className={cn('text-sm leading-none font-black tracking-tight italic', className)}>VISA</span>
  if (brand === 'amex') return <span aria-hidden="true" className={cn('rounded-[3px] border border-current px-1 text-[0.625rem] leading-3.5 font-bold tracking-wide', className)}>AMEX</span>
  if (brand === 'discover') {
    return (
      <span aria-hidden="true" className={cn('flex items-center text-[0.625rem] leading-none font-bold tracking-wide', className)}>
        DISC<span className="mx-px inline-block size-2 rounded-full bg-[#f58220]" />VER
      </span>
    )
  }
  return <CardIcon aria-hidden="true" className={cn('size-4', className)} strokeWidth={1.5} />
}
