import { useState } from 'react'
import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export type AvatarProps = Omit<ComponentProps<'span'>, 'children'> & {
  alt: string
  src?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'size-7 text-[0.625rem]',
  md: 'size-9 text-xs',
  lg: 'size-12 text-sm',
}

export default function Avatar({ alt, src, fallback, size = 'md', className, ...props }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>()
  const [loadedSrc, setLoadedSrc] = useState<string>()
  const initials = fallback ?? alt.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase()

  return (
    <span {...props} className={cn('inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-border bg-subtle font-medium text-muted', sizes[size], className)}>
      {src && failedSrc !== src
        ? <img src={src} alt={alt} onLoad={() => setLoadedSrc(src)} onError={() => setFailedSrc(src)} className={cn('size-full object-cover motion-safe:transition-opacity motion-safe:duration-200', loadedSrc === src ? 'opacity-100' : 'opacity-0')} />
        : <span role="img" aria-label={alt}>{initials}</span>}
    </span>
  )
}
