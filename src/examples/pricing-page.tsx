import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Minus, Sparkles } from 'lucide-react'
import { Accordion, Badge, Banner, Button, cn, SegmentedControl, useToast } from '@catpkgs/coffee-ui'
import ExampleHeader from './example-header.tsx'

type Billing = 'monthly' | 'yearly'

const plans = [
  { id: 'starter', name: 'Starter', description: 'For a single cart or pop-up.', monthly: 0, features: ['1 location', 'Up to 500 orders a month', 'Basic sales reports', 'Email support'], cta: 'Start for free' },
  { id: 'cafe', name: 'Café', description: 'For busy neighborhood shops.', monthly: 29, popular: true, features: ['Up to 3 locations', 'Unlimited orders', 'Loyalty program', 'Inventory alerts', 'Priority support'], cta: 'Start 14-day trial' },
  { id: 'roastery', name: 'Roastery', description: 'For chains and wholesale roasters.', monthly: 79, features: ['Unlimited locations', 'Wholesale ordering', 'Advanced analytics', 'API access', 'Dedicated success manager'], cta: 'Contact sales' },
]

const comparison: { feature: string; values: (boolean | string)[] }[] = [
  { feature: 'Locations', values: ['1', '3', 'Unlimited'] },
  { feature: 'Monthly orders', values: ['500', 'Unlimited', 'Unlimited'] },
  { feature: 'Loyalty program', values: [false, true, true] },
  { feature: 'Inventory alerts', values: [false, true, true] },
  { feature: 'Wholesale ordering', values: [false, false, true] },
  { feature: 'API access', values: [false, false, true] },
]

export default function PricingPage() {
  const { toast } = useToast()
  const [billing, setBilling] = useState<Billing>('yearly')
  const price = (monthly: number) => (billing === 'yearly' ? Math.round(monthly * 0.8) : monthly)

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-5xl space-y-8">
      <ExampleHeader title="Pricing" description="A pricing page with a billing toggle, a highlighted plan, an accessible comparison table, and an FAQ." />

      <section aria-labelledby="plans-heading" className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 id="plans-heading" className="text-3xl font-semibold tracking-tight">Simple plans for every shop</h2>
          <p className="max-w-md text-sm text-muted">Pay for what you brew. Switch plans or cancel anytime.</p>
          <div className="flex items-center gap-2">
            <SegmentedControl label="Billing period" value={billing} onValueChange={setBilling} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
            <Badge variant={billing === 'yearly' ? 'default' : 'outline'}>Save 20%</Badge>
          </div>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <li key={plan.id} className={cn('relative flex flex-col rounded-panel border bg-surface p-5 shadow-xs', plan.popular ? 'border-primary shadow-md md:-my-2 md:py-7' : 'border-border')}>
              {plan.popular && <Badge variant="default" className="absolute -top-2.5 left-1/2 -translate-x-1/2"><Sparkles aria-hidden="true" strokeWidth={1.5} />Most popular</Badge>}
              <h3 className="text-base font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.description}</p>
              <p className="mt-4 flex items-baseline gap-1">
                <motion.span key={`${plan.id}-${billing}`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-semibold tracking-tight">${price(plan.monthly)}</motion.span>
                <span className="text-sm text-muted">/ month</span>
              </p>
              <p className="mt-1 h-5 text-xs text-muted">{plan.monthly && billing === 'yearly' ? `$${price(plan.monthly) * 12} billed yearly` : plan.monthly ? 'Billed monthly' : 'Free forever'}</p>
              <Button variant={plan.popular ? 'primary' : 'outline'} className="mt-5 w-full" onClick={() => toast({ title: `${plan.name} selected`, description: 'This is a demo checkout.', variant: 'success' })}>{plan.cta}</Button>
              <ul className="mt-5 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="compare-heading" className="space-y-3">
        <h2 id="compare-heading" className="text-lg font-semibold">Compare plans</h2>
        <div role="region" aria-labelledby="compare-heading" tabIndex={0} className="overflow-x-auto rounded-panel border border-border bg-surface">
          <table className="w-full min-w-md border-collapse text-sm">
            <thead className="bg-subtle">
              <tr>
                <th scope="col" className="h-10 px-4 text-left text-xs font-medium text-muted">Feature</th>
                {plans.map((plan) => <th key={plan.id} scope="col" className={cn('h-10 px-4 text-center text-xs font-medium', plan.popular ? 'text-primary' : 'text-muted')}>{plan.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-t border-border">
                  <th scope="row" className="px-4 py-2.5 text-left font-normal">{row.feature}</th>
                  {row.values.map((value, index) => (
                    <td key={index} className={cn('px-4 py-2.5 text-center', plans[index]?.popular && 'bg-primary-soft/30')}>
                      {typeof value === 'string' ? <span className="tabular-nums">{value}</span>
                        : value ? <><Check aria-hidden="true" className="mx-auto size-4 text-primary" strokeWidth={2} /><span className="sr-only">Included</span></>
                          : <><Minus aria-hidden="true" className="mx-auto size-4 text-muted/60" strokeWidth={1.5} /><span className="sr-only">Not included</span></>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 id="faq-heading" className="text-lg font-semibold">Questions</h2>
          <p className="mt-1 text-sm text-muted">Can’t find an answer? Our team replies within a day.</p>
        </div>
        <Accordion items={[
          { value: 'trial', title: 'How does the free trial work?', content: <p>You get every Café feature for 14 days. We’ll remind you before it ends, and nothing is charged unless you pick a plan.</p> },
          { value: 'switch', title: 'Can I change plans later?', content: <p>Yes. Upgrades apply immediately and are prorated; downgrades take effect at the next billing date.</p> },
          { value: 'hardware', title: 'Do I need special hardware?', content: <p>No. Coffee UI runs on any tablet or laptop, and works with most receipt printers and card readers.</p> },
          { value: 'cancel', title: 'What happens if I cancel?', content: <p>You keep access until the end of your billing period and can export all of your sales data anytime.</p> },
        ]} />
      </section>

      <Banner variant="primary" icon={<Sparkles strokeWidth={1.5} />} title="Running more than 10 locations?" action={<Button size="sm" variant="secondary">Talk to sales</Button>}>
        We’ll build a plan around your menu and volume.
      </Banner>
    </motion.div>
  )
}
