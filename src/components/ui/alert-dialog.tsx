import { useState } from 'react'
import Button from './button.tsx'
import Dialog from './dialog.tsx'
import type { TriggerElement } from './trigger.ts'
import useControllableState from './use-controllable-state.ts'

export type AlertDialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: TriggerElement
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  errorMessage?: string
  onConfirm: () => void | Promise<void>
}

export default function AlertDialog({
  open: openProp, defaultOpen = false, onOpenChange, trigger, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  destructive = false, errorMessage = 'The action could not be completed. Please try again.', onConfirm,
}: AlertDialogProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  function changeOpen(next: boolean) {
    if (pending) return
    setError('')
    setOpen(next)
  }

  async function confirm() {
    if (pending) return
    setPending(true)
    setError('')
    try {
      await onConfirm()
      setOpen(false)
    } catch {
      setError(errorMessage)
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={changeOpen}
      trigger={trigger}
      title={title}
      description={description}
      role="alertdialog"
      showCloseButton={false}
      footer={<>
        <Button autoFocus variant="secondary" disabled={pending} onClick={() => changeOpen(false)}>{cancelLabel}</Button>
        <Button variant={destructive ? 'destructive' : 'primary'} loading={pending} onClick={confirm}>{confirmLabel}</Button>
      </>}
    >
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    </Dialog>
  )
}
