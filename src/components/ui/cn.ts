import { extendTailwindMerge } from 'tailwind-merge'
import type { ClassNameValue } from 'tailwind-merge'

// Teach tailwind-merge the custom theme tokens so overrides like className="bg-surface" replace defaults.
const merge = extendTailwindMerge({
  extend: {
    theme: {
      color: ['background', 'surface', 'subtle', 'border', 'foreground', 'muted', 'primary', 'primary-hover', 'primary-soft', 'on-primary', 'danger', 'destructive', 'destructive-hover', 'on-destructive', 'chart-1', 'chart-2', 'chart-3', 'chart-4'],
      radius: ['control', 'inner', 'panel'],
    },
  },
})

export function cn(...classes: ClassNameValue[]) {
  return merge(classes)
}
