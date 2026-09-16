import { Button, Fieldset, Select, Switch, TextField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Fieldset, TextField } from '@catpkgs/coffee-ui'

<form>
  <Fieldset legend="Shipping address" description="Where should we send your beans?">
    <TextField label="Street" autoComplete="street-address" />
    <TextField label="City" autoComplete="address-level2" />
  </Fieldset>
</form>`

export default function FieldsetPage() {
  return (
    <PrimitivePage title="Fieldset" description="Groups related form fields under a legend, which screen readers announce when entering the group. Set disabled to turn off every control inside at once." code={code}>
      <form className="max-w-md space-y-6" onSubmit={(event) => event.preventDefault()}>
        <Fieldset legend="Shipping address" description="Where should we send your beans?">
          <TextField label="Street" autoComplete="street-address" />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="City" autoComplete="address-level2" />
            <Select label="Country" autoComplete="country-name" options={[{ value: 'us', label: 'United States' }, { value: 'fr', label: 'France' }]} />
          </div>
        </Fieldset>
        <Fieldset legend="Subscription" description="Managed by your organization." disabled>
          <Switch label="Monthly delivery" defaultChecked />
        </Fieldset>
        <Button type="submit">Save</Button>
      </form>
    </PrimitivePage>
  )
}
