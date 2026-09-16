import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, CircleCheck, Lock, ShoppingBag, Trash2 } from 'lucide-react'
import {
  Button, Card, Checkbox, CreditCardField, emptyCreditCard, EmptyState, Fieldset, IconButton, NumberField, RadioGroup, SegmentedControl, Select, Separator, Stepper,
  Tag, TextField, useToast, validateCreditCard,
} from '@catpkgs/coffee-ui'
import ExampleHeader from './example-header.tsx'

type Item = { id: string; name: string; roast: string; weight: string; price: number; quantity: number; color: string }

const initialCart: Item[] = [
  { id: 'ethiopia', name: 'Ethiopia Yirgacheffe', roast: 'Light roast', weight: '250 g', price: 18, quantity: 2, color: '#c9a27e' },
  { id: 'colombia', name: 'Colombia Huila', roast: 'Medium roast', weight: '250 g', price: 16, quantity: 1, color: '#8a5a3b' },
  { id: 'espresso', name: 'House Espresso', roast: 'Dark roast', weight: '1 kg', price: 42, quantity: 1, color: '#4a2f22' },
]

const shipping = { standard: 0, express: 9, pickup: 0 }
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function CheckoutPage() {
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [cart, setCart] = useState(initialCart)
  const [method, setMethod] = useState<keyof typeof shipping>('standard')
  const [promo, setPromo] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState<string>()
  const [contact, setContact] = useState({ email: '', name: '', address: '', city: '' })
  const [payment, setPayment] = useState<'card' | 'wallet'>('card')
  const [paying, setPaying] = useState(false)
  const [card, setCard] = useState(emptyCreditCard)
  const [payAttempted, setPayAttempted] = useState(false)
  const [paid, setPaid] = useState(false)
  const [attempted, setAttempted] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = subtotal * discount
  const tax = (subtotal - savings) * 0.08
  const total = subtotal - savings + shipping[method] + tax
  const detailsErrors = {
    email: /^\S+@\S+\.\S+$/.test(contact.email) ? undefined : 'Enter an email for your receipt.',
    name: contact.name.trim() ? undefined : 'Enter the recipient’s name.',
    address: method === 'pickup' || contact.address.trim() ? undefined : 'Enter a street address.',
  }
  const detailsValid = !Object.values(detailsErrors).some(Boolean)

  function applyPromo() {
    if (promo.trim().toUpperCase() === 'BEANS10') {
      setDiscount(0.1)
      setPromoError(undefined)
      toast({ title: 'Promo applied', description: '10% off your beans.', variant: 'success' })
    } else {
      setDiscount(0)
      setPromoError('That code isn’t valid. Try BEANS10.')
    }
  }

  function continueFromDetails() {
    setAttempted(true)
    if (detailsValid) setStep(2)
  }

  function pay() {
    setPayAttempted(true)
    if (payment === 'card' && !validateCreditCard(card).valid) return
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setPaid(true)
      toast({ title: 'Order placed', description: `We emailed a receipt to ${contact.email}.`, variant: 'success' })
    }, 1200)
  }

  if (paid) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto w-full max-w-md py-10">
        <EmptyState
          icon={<CircleCheck strokeWidth={1.5} />}
          title="Thanks, your order is on its way"
          description={`Order #4822 · ${money.format(total)}. We’ll send tracking details to ${contact.email}.`}
          action={<Button variant="outline" onClick={() => { setPaid(false); setStep(0); setCart(initialCart) }}>Start over</Button>}
          className="border-solid bg-surface"
        />
      </motion.div>
    )
  }

  const summary = (
    <Card title="Order summary" className="lg:sticky lg:top-4">
      <div className="space-y-3 text-sm">
        <ul className="space-y-2.5">
          {cart.map((item) => (
            <li key={item.id} className="flex items-center gap-2.5">
              <span aria-hidden="true" className="relative size-9 shrink-0 rounded-inner" style={{ backgroundColor: item.color }}>
                <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[0.625rem] font-semibold text-background">{item.quantity}</span>
              </span>
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              <span className="tabular-nums">{money.format(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="flex items-start gap-1.5">
          <div className="flex-1"><TextField label="Promo code" hideLabel placeholder="Promo code" value={promo} onValueChange={setPromo} error={promoError} onKeyDown={(event) => { if (event.key === 'Enter') applyPromo() }} /></div>
          <Button variant="outline" disabled={!promo.trim()} onClick={applyPromo}>Apply</Button>
        </div>
        <dl className="space-y-1.5">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{money.format(subtotal)}</dd></div>
          {discount > 0 && <div className="flex justify-between"><dt className="flex items-center gap-1.5 text-muted">Discount <Tag variant="primary">BEANS10</Tag></dt><dd className="tabular-nums text-primary">−{money.format(savings)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="tabular-nums">{shipping[method] ? money.format(shipping[method]) : 'Free'}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd className="tabular-nums">{money.format(tax)}</dd></div>
        </dl>
        <Separator />
        <div className="flex items-baseline justify-between">
          <span className="font-medium">Total</span>
          <span className="text-lg font-semibold">{money.format(total)}</span>
        </div>
      </div>
    </Card>
  )

  const steps = [
    (
      <Card key="cart" title="Your cart" description={`${cart.reduce((sum, item) => sum + item.quantity, 0)} items`} footer={cart.length ? <Button onClick={() => setStep(1)}>Continue to details</Button> : undefined}>
        {cart.length ? (
          <ul className="divide-y divide-border">
            {cart.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span aria-hidden="true" className="size-14 shrink-0 rounded-inner" style={{ backgroundColor: item.color }} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted"><Tag>{item.roast}</Tag>{item.weight} · {money.format(item.price)}</p>
                </div>
                <div className="w-32"><NumberField label={`Quantity of ${item.name}`} hideLabel min={1} max={10} value={item.quantity} onValueChange={(quantity) => setCart(cart.map((entry) => (entry.id === item.id ? { ...entry, quantity: quantity ?? 1 } : entry)))} /></div>
                <IconButton aria-label={`Remove ${item.name}`} onClick={() => setCart(cart.filter((entry) => entry.id !== item.id))}><Trash2 strokeWidth={1.5} /></IconButton>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<ShoppingBag strokeWidth={1.5} />} title="Your cart is empty" description="Add some beans to get brewing." action={<Button variant="outline" onClick={() => setCart(initialCart)}>Restore cart</Button>} />
        )}
      </Card>
    ),
    (
      <Card key="details" title="Delivery details" footer={<>
        <Button variant="ghost" onClick={() => setStep(0)}><ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />Back</Button>
        <Button onClick={continueFromDetails}>Continue to payment</Button>
      </>}>
        <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); continueFromDetails() }}>
          <Fieldset legend="Contact">
            <TextField label="Email" type="email" autoComplete="email" required value={contact.email} onValueChange={(email) => setContact({ ...contact, email })} error={attempted ? detailsErrors.email : undefined} />
          </Fieldset>
          <RadioGroup label="Delivery method" value={method} onValueChange={(value) => setMethod(value as keyof typeof shipping)} options={[
            { value: 'standard', label: 'Standard · Free', hint: '3–5 business days' },
            { value: 'express', label: 'Express · $9.00', hint: 'Next business day' },
            { value: 'pickup', label: 'Pick up in store · Free', hint: 'Ready in 2 hours at Downtown' },
          ]} />
          <Fieldset legend={method === 'pickup' ? 'Pickup' : 'Shipping address'}>
            <TextField label="Full name" autoComplete="name" required value={contact.name} onValueChange={(name) => setContact({ ...contact, name })} error={attempted ? detailsErrors.name : undefined} />
            {method !== 'pickup' && <>
              <TextField label="Street address" autoComplete="street-address" required value={contact.address} onValueChange={(address) => setContact({ ...contact, address })} error={attempted ? detailsErrors.address : undefined} />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="City" autoComplete="address-level2" value={contact.city} onValueChange={(city) => setContact({ ...contact, city })} />
                <Select label="Country" autoComplete="country-name" defaultValue="us" options={[{ value: 'us', label: 'United States' }, { value: 'gb', label: 'United Kingdom' }]} />
              </div>
            </>}
          </Fieldset>
        </form>
      </Card>
    ),
    (
      <Card key="payment" title="Payment" description="All transactions are encrypted." footer={<>
        <Button variant="ghost" disabled={paying} onClick={() => setStep(1)}><ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />Back</Button>
        <Button loading={paying} onClick={pay}><Lock aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Pay {money.format(total)}</Button>
      </>}>
        <div className="space-y-4">
          <SegmentedControl label="Payment method" value={payment} onValueChange={setPayment} options={[{ value: 'card', label: 'Card' }, { value: 'wallet', label: 'Wallet' }]} />
          {payment === 'card' ? (
            <div className="space-y-3">
              <CreditCardField label="Card" value={card} onValueChange={setCard} showErrors={payAttempted} showPreview previewTheme="espresso" />
              <Checkbox label="Billing address is the same as shipping" defaultChecked />
            </div>
          ) : (
            <p className="text-sm leading-5 text-muted">You’ll confirm the payment in your wallet app after pressing Pay.</p>
          )}
        </div>
      </Card>
    ),
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-5xl space-y-5">
      <ExampleHeader title="Checkout" description="A three-step purchase flow with quantity controls, a live order summary, promo codes, validation on continue, and a success state. Try the code BEANS10 and card 4242 4242 4242 4242." />
      <Stepper aria-label="Checkout progress" current={step} onStepClick={setStep} steps={[
        { label: 'Cart', description: 'Review items' },
        { label: 'Details', description: 'Contact and delivery' },
        { label: 'Payment', description: 'Confirm and pay' },
      ]} />
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_20rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
            {steps[step]}
          </motion.div>
        </AnimatePresence>
        {summary}
      </div>
    </motion.div>
  )
}
