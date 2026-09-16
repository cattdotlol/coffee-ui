import { useState } from 'react'
import { Coffee, CupSoda, Leaf } from 'lucide-react'
import { Suggestions } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Suggestions } from '@catpkgs/coffee-ui'

<Suggestions
  suggestions={['Dial in espresso', { label: 'Cold brew', icon: <CupSoda />, value: 'How do I make cold brew?' }]}
  onSelect={send}
/>

// Keep suggestions on one line.
<Suggestions layout="scroll" suggestions={items} onSelect={send} />`

const items = [
  { label: 'Dial in espresso', icon: <Coffee strokeWidth={1.5} />, value: 'How do I dial in espresso?' },
  { label: 'Cold brew', icon: <CupSoda strokeWidth={1.5} />, value: 'How do I make cold brew at home?' },
  { label: 'Matcha latte', icon: <Leaf strokeWidth={1.5} />, value: 'What is a good matcha latte ratio?' },
  'Compare light and dark roasts',
  'Suggest a pour-over recipe',
]

export default function SuggestionsPage() {
  const [message, setMessage] = useState('Choose a suggestion.')
  return (
    <PrimitivePage title="Suggestions" description="Starter prompts that send a message in one click. Each suggestion can show a short label while sending a longer prompt. Wrap them or keep them on one scrollable line." code={code}>
      <div className="max-w-lg space-y-4">
        <Suggestions suggestions={items} onSelect={(value) => setMessage(`Sent: “${value}”`)} />
        <Suggestions layout="scroll" label="More suggestions" suggestions={items} onSelect={(value) => setMessage(`Sent: “${value}”`)} />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
