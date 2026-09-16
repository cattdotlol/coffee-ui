import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from './cn.ts'
import TextField from './text-field.tsx'
import type { TextFieldProps } from './text-field.tsx'

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing'> & {
  showStrength?: boolean
}

const levels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

function score(password: string) {
  if (!password) return 0
  const checks = [password.length >= 8, password.length >= 12, /[a-z]/.test(password) && /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)]
  return Math.min(4, Math.max(1, checks.filter(Boolean).length - (password.length < 8 ? 1 : 0)))
}

export default function PasswordField({ showStrength = false, hint, value, defaultValue, onValueChange, autoComplete = 'current-password', ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const [internal, setInternal] = useState(String(defaultValue ?? ''))
  const current = value === undefined ? internal : String(value)
  const strength = score(current)

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      value={value}
      defaultValue={defaultValue}
      spellCheck={false}
      onValueChange={(next) => { setInternal(next); onValueChange?.(next) }}
      hint={showStrength && current ? (
        <span className="grid gap-1">
          <span aria-hidden="true" className="flex gap-1">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index} className={cn('h-1 flex-1 rounded-full motion-safe:transition-colors', index < strength ? (strength <= 1 ? 'bg-danger' : 'bg-primary') : 'bg-border')} />
            ))}
          </span>
          <span>Strength: {levels[strength]}{hint ? <> · {hint}</> : null}</span>
        </span>
      ) : hint}
      trailing={
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          disabled={props.disabled}
          onClick={() => setVisible(!visible)}
          className="-mr-1 inline-flex size-6 cursor-pointer items-center justify-center rounded-full hover:bg-subtle hover:text-foreground disabled:cursor-not-allowed"
        >
          {visible ? <EyeOff aria-hidden="true" className="size-4" strokeWidth={1.5} /> : <Eye aria-hidden="true" className="size-4" strokeWidth={1.5} />}
        </button>
      }
    />
  )
}
