import { useState } from 'react'
import { Select } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Select } from '@catpkgs/coffee-ui'

<Select
  label="Language"
  placeholder="Choose a language"
  options={[
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
  ]}
  value={language}
  onValueChange={setLanguage}
/>

// Children still work for option groups.
<Select label="Region">
  <optgroup label="Asia"><option value="jp">Japan</option></optgroup>
</Select>`

const languages = [
  { value: 'en', label: 'English' },
  { value: 'bn', label: 'Bengali' },
  { value: 'fr', label: 'French' },
  { value: 'ja', label: 'Japanese', disabled: true },
]

export default function SelectPage() {
  const [language, setLanguage] = useState('en')
  return (
    <PrimitivePage title="Select" description="Choose from a list using the native menu and keyboard controls. Pass options for the common case or children for option groups. Supports placeholder, hints, errors, and onValueChange." code={code}>
      <div className="max-w-sm space-y-4">
        <Select label="Language" name="language" hint="Choose your preferred language." options={languages} value={language} onValueChange={setLanguage} />
        <Select label="Region" placeholder="Select a region" error="Choose a region." options={[{ value: 'asia', label: 'Asia' }, { value: 'europe', label: 'Europe' }]} />
        <Select label="Timezone">
          <optgroup label="Asia"><option value="tokyo">Tokyo</option></optgroup>
          <optgroup label="Europe"><option value="paris">Paris</option></optgroup>
        </Select>
        <Select label="Managed preference" disabled defaultValue="en" options={languages} />
        <p role="status" className="text-sm text-muted">Selected language: {language}.</p>
      </div>
    </PrimitivePage>
  )
}
