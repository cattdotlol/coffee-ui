import { useEffect, useState } from 'react'
import { Button, Reasoning } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Reasoning } from '@catpkgs/coffee-ui'

<Reasoning streaming={isThinking} duration={4}>
  {reasoningText}
</Reasoning>`

const thoughts = 'The user wants a sweeter espresso.\nSourness usually means under-extraction, so a finer grind or a longer ratio should help.\nSuggest one change at a time.'

export default function ReasoningPage() {
  const [streaming, setStreaming] = useState(false)

  useEffect(() => {
    if (!streaming) return
    const timer = setTimeout(() => setStreaming(false), 3000)
    return () => clearTimeout(timer)
  }, [streaming])

  return (
    <PrimitivePage title="Reasoning" description="A collapsible section for a model's thinking. It shows Thinking… while streaming and how long it took once finished, and stays out of the way until opened." code={code}>
      <div className="max-w-lg space-y-4">
        <Reasoning streaming={streaming} duration={3}>{thoughts}</Reasoning>
        <Button variant="outline" size="sm" disabled={streaming} onClick={() => setStreaming(true)}>Simulate thinking</Button>
      </div>
    </PrimitivePage>
  )
}
