import { useId, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Lock } from 'lucide-react'
import { cn } from './cn.ts'
import CardBrandMark from './card-brand-mark.tsx'
import CreditCard from './credit-card.tsx'
import type { CreditCardProps } from './credit-card.tsx'
import { cardBrandNames, cardNumberLength, cvcLength, detectCardBrand, emptyCreditCard, formatCardNumber, formatExpiry, validateCreditCard } from './credit-card-utils.ts'
import type { CreditCardValue } from './credit-card-utils.ts'
import TextField from './text-field.tsx'
import useControllableState from './use-controllable-state.ts'

export type CreditCardFieldProps = {
  label?: string
  value?: CreditCardValue
  defaultValue?: CreditCardValue
  onValueChange?: (value: CreditCardValue) => void
  showName?: boolean
  showPreview?: boolean
  previewTheme?: CreditCardProps['theme']
  showErrors?: boolean
  disabled?: boolean
  name?: string
  className?: string
}

type Field = keyof CreditCardValue

// Reapplying formatting moves the caret to the end, so put it back after the same number of digits.
function keepCaret(event: ChangeEvent<HTMLInputElement>, formatted: string) {
  const input = event.target
  const digitsBefore = input.value.slice(0, input.selectionStart ?? input.value.length).replace(/\D/g, '').length
  requestAnimationFrame(() => {
    let position = 0
    let seen = 0
    while (position < formatted.length && seen < digitsBefore) {
      if (/\d/.test(formatted[position]!)) seen++
      position++
    }
    if (document.activeElement === input) input.setSelectionRange(position, position)
  })
}

export default function CreditCardField({
  label = 'Card details', value, defaultValue = emptyCreditCard, onValueChange, showName = false, showPreview = false, previewTheme,
  showErrors = false, disabled, name, className,
}: CreditCardFieldProps) {
  const id = useId()
  const [card, setCard] = useControllableState(value, defaultValue, onValueChange)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [cvcFocused, setCvcFocused] = useState(false)
  const brand = detectCardBrand(card.number)
  const { errors } = validateCreditCard(card, { requireName: showName })
  const errorFor = (field: Field) => (showErrors || touched[field] ? errors[field] : undefined)
  const set = (field: Field, next: string) => setCard({ ...card, [field]: next })
  const blur = (field: Field) => setTouched((current) => ({ ...current, [field]: true }))
  const fieldName = (field: string) => (name ? `${name}-${field}` : undefined)

  return (
    <fieldset disabled={disabled} className={cn('min-w-0 disabled:opacity-50', className)}>
      <legend className="mb-2 flex items-center gap-1.5 text-sm font-medium">
        {label}
        <Lock aria-hidden="true" className="size-3 text-muted" strokeWidth={2} />
      </legend>
      {showPreview && (
        <CreditCard number={card.number} name={card.name} expiry={card.expiry} cvc={card.cvc} flipped={cvcFocused} theme={previewTheme} className="mx-auto mb-4" />
      )}
      <div className="grid gap-3">
        {showName && (
          <TextField label="Name on card" name={fieldName('name')} autoComplete="cc-name" value={card.name} onValueChange={(next) => set('name', next)} onBlur={() => blur('name')} error={errorFor('name')} />
        )}
        <TextField
          label="Card number"
          name={fieldName('number')}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder={brand === 'amex' ? '3782 822463 10005' : '1234 1234 1234 1234'}
          maxLength={cardNumberLength(brand) + (brand === 'amex' ? 2 : 3)}
          value={card.number}
          onChange={(event) => {
            const formatted = formatCardNumber(event.target.value)
            keepCaret(event, formatted)
            set('number', formatted)
          }}
          onBlur={() => blur('number')}
          error={errorFor('number')}
          aria-describedby={`${id}-brand`}
          className="font-mono tabular-nums"
          leading={<span className="flex w-7 justify-center text-foreground"><CardBrandMark brand={brand} /></span>}
        />
        <span id={`${id}-brand`} className="sr-only" aria-live="polite">{brand === 'unknown' ? '' : `${cardBrandNames[brand]} detected`}</span>
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Expiry"
            name={fieldName('expiry')}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM / YY"
            maxLength={7}
            value={card.expiry}
            onChange={(event) => {
              const formatted = formatExpiry(event.target.value)
              keepCaret(event, formatted)
              set('expiry', formatted)
            }}
            onBlur={() => blur('expiry')}
            error={errorFor('expiry')}
            className="tabular-nums"
          />
          <TextField
            label="Security code"
            name={fieldName('cvc')}
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder={brand === 'amex' ? '1234' : '123'}
            maxLength={cvcLength(brand)}
            value={card.cvc}
            onValueChange={(next) => set('cvc', next.replace(/\D/g, '').slice(0, cvcLength(brand)))}
            onFocus={() => setCvcFocused(true)}
            onBlur={() => { setCvcFocused(false); blur('cvc') }}
            hint={errorFor('cvc') ? undefined : brand === 'amex' ? '4 digits on the front' : '3 digits on the back'}
            error={errorFor('cvc')}
            className="tabular-nums"
          />
        </div>
      </div>
    </fieldset>
  )
}
