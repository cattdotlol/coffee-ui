import { useState } from 'react'
import type { FormEvent } from 'react'
import { SendHorizontal } from 'lucide-react'
import { ChatMessage, IconButton, MessageList, TextField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { ChatMessage, MessageList } from '@catpkgs/coffee-ui'

<MessageList label="Conversation with Grace" className="h-80">
  <ChatMessage author="Grace Hopper" time="9:41 AM">
    Are we still on for the tasting?
  </ChatMessage>
  <ChatMessage author="Grace Hopper" grouped>
    I brought the Ethiopian lot.
  </ChatMessage>
  <ChatMessage author="You" variant="outgoing" time="9:42 AM" status="Read">
    Yes! See you at 10.
  </ChatMessage>
</MessageList>`

type Message = { id: number; author: string; outgoing: boolean; text: string; time: string; status?: string }

const initialMessages: Message[] = [
  { id: 1, author: 'Grace Hopper', outgoing: false, text: 'Morning! The roaster dropped off the autumn samples.', time: '9:38 AM' },
  { id: 2, author: 'Grace Hopper', outgoing: false, text: 'Are we still on for the tasting at 10?', time: '9:38 AM' },
  { id: 3, author: 'You', outgoing: true, text: 'Yes, I will be there. Did the Ethiopian lot come in?', time: '9:40 AM', status: 'Read' },
  { id: 4, author: 'Grace Hopper', outgoing: false, text: 'It did. Bright, floral, a little jammy.\nI think you will like it.', time: '9:41 AM' },
]

export default function MessageListPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    setMessages((current) => [...current, { id: Date.now(), author: 'You', outgoing: true, text, time, status: 'Sent' }])
    setDraft('')
  }

  return (
    <PrimitivePage title="MessageList" description="A scrollable conversation built from ChatMessage bubbles. It stays pinned to the newest message unless the reader has scrolled up, and announces new messages to screen readers. Group consecutive messages from the same author." code={code}>
      <div className="flex max-w-lg flex-col overflow-hidden rounded-panel border border-border bg-surface">
        <MessageList label="Conversation with Grace Hopper" className="h-80">
          {messages.map((message, index) => {
            const previous = messages[index - 1]
            const next = messages[index + 1]
            return (
              <ChatMessage
                key={message.id}
                author={message.author}
                variant={message.outgoing ? 'outgoing' : 'incoming'}
                grouped={previous?.author === message.author}
                time={next?.author === message.author ? undefined : message.time}
                status={message.status}
              >
                {message.text}
              </ChatMessage>
            )
          })}
        </MessageList>
        <form onSubmit={send} className="flex items-end gap-2 border-t border-border p-3">
          <div className="flex-1">
            <TextField label="Message" hideLabel placeholder="Write a message" value={draft} onValueChange={setDraft} />
          </div>
          <IconButton type="submit" variant="primary" aria-label="Send message" disabled={!draft.trim()}><SendHorizontal strokeWidth={1.5} /></IconButton>
        </form>
      </div>
    </PrimitivePage>
  )
}
