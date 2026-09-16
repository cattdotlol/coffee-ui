import type { ComponentProps } from 'react'
import { cn } from './cn.ts'
import Avatar from './avatar.tsx'
import type { AvatarProps } from './avatar.tsx'

export type AvatarGroupProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: string
  avatars: readonly Pick<AvatarProps, 'alt' | 'src' | 'fallback'>[]
  max?: number
  size?: AvatarProps['size']
}

const overflowSizes = { sm: 'size-7 text-[0.625rem]', md: 'size-9 text-xs', lg: 'size-12 text-sm' }

export default function AvatarGroup({ label, avatars, max = 4, size = 'md', className, ...props }: AvatarGroupProps) {
  const shown = avatars.slice(0, max)
  const hidden = avatars.slice(max)

  return (
    <div {...props} role="group" aria-label={label} className={cn('flex items-center', size === 'sm' ? '-space-x-1.5' : '-space-x-2', className)}>
      {shown.map((avatar, index) => <Avatar key={`${avatar.alt}-${index}`} {...avatar} size={size} className="ring-2 ring-surface" />)}
      {hidden.length > 0 && (
        <span
          role="img"
          aria-label={`${hidden.length} more: ${hidden.map((avatar) => avatar.alt).join(', ')}`}
          title={hidden.map((avatar) => avatar.alt).join(', ')}
          className={cn('inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-primary-soft font-medium text-primary tabular-nums ring-2 ring-surface', overflowSizes[size])}
        >
          +{hidden.length}
        </span>
      )}
    </div>
  )
}
