import { useState } from 'react'
import { ChatMessage, MessageActions } from '@catpkgs/coffee-ui'
import type { MessageFeedback } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { ChatMessage, MessageActions } from '@catpkgs/coffee-ui'

<ChatMessage author="Assistant">{text}</ChatMessage>
<MessageActions
  content={text}
  onRegenerate={regenerate}
  feedback={feedback}
  onFeedbackChange={setFeedback}
/>`

const answer = 'Use about 18 g of coffee for a 36 g double shot, and aim for 25 to 30 seconds.'

export default function MessageActionsPage() {
  const [feedback, setFeedback] = useState<MessageFeedback>(null)
  const [message, setMessage] = useState('Try copying, regenerating, or rating the response.')

  return (
    <PrimitivePage title="MessageActions" description="Copy, regenerate, and feedback controls for an assistant response. The controls form one toolbar, so Tab reaches them once and arrow keys move between them." code={code}>
      <div className="max-w-lg">
        <ChatMessage author="Assistant">{answer}</ChatMessage>
        <MessageActions
          content={answer}
          className="mt-1 ml-9"
          onRegenerate={() => setMessage('Regenerate selected.')}
          feedback={feedback}
          onFeedbackChange={(next) => { setFeedback(next); setMessage(next ? `Marked as ${next === 'up' ? 'good' : 'bad'}.` : 'Feedback cleared.') }}
        />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
