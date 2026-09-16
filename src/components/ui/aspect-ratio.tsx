import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export type AspectRatioProps = ComponentProps<'div'> & {
  ratio?: number
}

export default function AspectRatio({ ratio = 16 / 9, style, className, ...props }: AspectRatioProps) {
  return (
    <div
      {...props}
      style={{ aspectRatio: ratio, ...style }}
      className={cn('relative w-full overflow-hidden [&>iframe]:size-full [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover', className)}
    />
  )
}
