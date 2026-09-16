import { cn } from './cn.ts'
import Button from './button.tsx'
import type { ButtonProps } from './button.tsx'
import useControllableState from './use-controllable-state.ts'

export type ToggleProps = Omit<ButtonProps, 'variant' | 'aria-pressed'> & {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

export default function Toggle({ pressed, defaultPressed = false, onPressedChange, onClick, className, ...props }: ToggleProps) {
  const [current, setCurrent] = useControllableState(pressed, defaultPressed, onPressedChange)

  return (
    <Button
      {...props}
      variant="ghost"
      aria-pressed={current}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setCurrent(!current)
      }}
      className={cn('aria-pressed:bg-primary-soft', className)}
    />
  )
}
