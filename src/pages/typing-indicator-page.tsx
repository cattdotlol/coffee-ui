import { ChatMessage, TypingIndicator } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { ChatMessage, TypingIndicator } from '@catpkgs/coffee-ui'

// While waiting for the first token.
<ChatMessage author="Assistant"><TypingIndicator /></ChatMessage>

// At the end of a streaming response.
<ChatMessage author="Assistant">
  {text}<TypingIndicator variant="cursor" label="Assistant is responding" />
</ChatMessage>`

export default function TypingIndicatorPage() {
  return (
    <PrimitivePage title="TypingIndicator" description="Shows that a response is on its way. Use dots before the first token arrives and a cursor while text streams in. Animation is disabled for people who prefer reduced motion." code={code}>
      <div className="flex max-w-lg flex-col gap-3">
        <ChatMessage author="Assistant"><TypingIndicator /></ChatMessage>
        <ChatMessage author="Assistant">
          A flat white uses a double shot with a thin layer of microfoam<TypingIndicator variant="cursor" label="Assistant is responding" />
        </ChatMessage>
      </div>
    </PrimitivePage>
  )
}
