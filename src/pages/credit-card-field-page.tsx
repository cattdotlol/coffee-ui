import { useState } from 'react'
import { Badge, Button, CreditCardField, emptyCreditCard, useToast, validateCreditCard } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { CreditCardField, emptyCreditCard, validateCreditCard } from '@catpkgs/coffee-ui'

function Payment() {
  const [card, setCard] = useState(emptyCreditCard)
  const [submitted, setSubmitted] = useState(false)

  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      setSubmitted(true)
      if (validateCreditCard(card, { requireName: true }).valid) pay(card)
    }}>
      <CreditCardField value={card} onValueChange={setCard} showName showPreview showErrors={submitted} />
      <Button type="submit">Pay</Button>
    </form>
  )
}`

export default function CreditCardFieldPage() {
  const { toast } = useToast()
  const [card, setCard] = useState(emptyCreditCard)
  const [submitted, setSubmitted] = useState(false)
  const { brand, valid } = validateCreditCard(card, { requireName: true })

  return (
    <PrimitivePage title="CreditCardField" description="Card number, expiry, and security code inputs with formatting as you type, brand detection, and Luhn, expiry, and length checks. Errors appear after leaving a field or on submit. Autocomplete attributes let browsers and password managers fill saved cards. Try 4242 4242 4242 4242 or 3782 822463 10005." code={code}>
      <form
        noValidate
        className="mx-auto max-w-sm space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
          if (valid) toast({ title: 'Card accepted', description: 'This is a demo; nothing was charged.', variant: 'success' })
        }}
      >
        <CreditCardField value={card} onValueChange={setCard} showName showPreview showErrors={submitted} />
        <div className="flex items-center justify-between gap-3">
          <Badge dot variant={valid ? 'default' : 'outline'}>{valid ? `Valid ${brand === 'unknown' ? 'card' : brand}` : 'Incomplete'}</Badge>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setCard(emptyCreditCard); setSubmitted(false) }}>Clear</Button>
            <Button type="submit">Save card</Button>
          </div>
        </div>
      </form>
    </PrimitivePage>
  )
}
