import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { motion } from 'motion/react'
import Button from './button.tsx'
import type { ButtonProps } from './button.tsx'
import IconButton from './icon-button.tsx'

export type CopyButtonProps = Omit<ButtonProps, 'onClick' | 'children' | 'value' | 'onCopy'> & {
  value: string | (() => string)
  label?: string
  copiedLabel?: string
  errorLabel?: string
  iconOnly?: boolean
  onCopy?: (value: string) => void
}

export default function CopyButton({ value, label = 'Copy', copiedLabel = 'Copied', errorLabel = 'Copy failed', iconOnly = false, onCopy, variant = 'ghost', ...props }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(timer)
  }, [state])

  async function copy() {
    const text = typeof value === 'function' ? value() : value
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
      onCopy?.(text)
    } catch {
      setState('error')
    }
  }

  const text = state === 'copied' ? copiedLabel : state === 'error' ? errorLabel : label
  const icon = (
    <motion.span key={state} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} aria-hidden="true" className="inline-flex size-full items-center justify-center">
      {state === 'copied' ? <Check className="size-3.5 text-primary" strokeWidth={2} /> : <Copy className="size-3.5" strokeWidth={1.5} />}
    </motion.span>
  )

  return (
    <>
      {iconOnly
        ? <IconButton {...props} variant={variant} aria-label={label} onClick={copy}>{icon}</IconButton>
        : <Button {...props} variant={variant} onClick={copy}><span className="size-3.5">{icon}</span>{text}</Button>}
      <span role="status" className="sr-only">{state === 'idle' ? '' : text}</span>
    </>
  )
}
