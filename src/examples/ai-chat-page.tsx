import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { motion } from 'motion/react'
import { Paperclip, Sparkles, SquarePen, Trash2 } from 'lucide-react'
import {
  AttachmentList, Badge, Button, ChatMessage, ConversationList, EmptyState, IconButton, MessageActions, MessageList, PromptInput, Reasoning,
  ScrollArea, Sources, Suggestions, ToolCall, Tooltip, TypingIndicator, useToast,
} from '@catpkgs/coffee-ui'
import type { Attachment } from '@catpkgs/coffee-ui'
import ExampleHeader from './example-header.tsx'

type Message = { id: number; role: 'user' | 'assistant'; text: string; response?: number; attachments?: Attachment[] }
type ChatHistory = { id: string; title: string; updatedAt: Date; messages: Message[] }

const suggestions = ['How do I dial in espresso?', 'Suggest a pour-over recipe', 'Compare light and dark roasts']

const responses = [
  {
    reasoning: 'The user wants to dial in espresso.\nStart from a common baseline recipe, then explain how to adjust grind based on taste and shot time.',
    tool: { name: 'get_grinder_settings', input: { grinder: 'Niche Zero', method: 'espresso' }, output: { recommended: 12, range: [8, 16] } },
    sources: [
      { title: 'Espresso extraction basics', url: 'https://www.example.com/espresso', description: 'How grind size, dose, yield, and time affect sweetness, acidity, and bitterness.' },
      { title: 'Dialing in with a new bag', url: 'https://coffee.example.org/dial-in', description: 'A step-by-step method for adjusting one variable at a time.' },
    ],
    text: 'Start with 18 g of finely ground coffee and aim for 36 g of espresso in 25 to 30 seconds. If it runs fast and tastes sour, grind finer. If it runs slow and tastes bitter, grind coarser. Change one variable at a time and taste after every shot.',
  },
  {
    reasoning: 'A pour-over recipe needs a ratio, water temperature, bloom, and pour schedule.\nA 1:16 ratio is a friendly default.',
    sources: [
      { title: 'Water temperature for brewing', url: 'https://coffee.example.org/water', description: 'Why most brewing guides recommend water between 90 and 96 °C.' },
    ],
    text: 'Try 15 g of medium-fine coffee to 250 g of water at 94 °C. Bloom with 40 g for 30 seconds, then pour in slow circles to 150 g, pause, and finish at 250 g. Total brew time should land around 3 minutes.',
  },
  {
    reasoning: 'Compare flavour, acidity, body, and caffeine.\nCorrect the common myth that dark roasts have much more caffeine.',
    sources: [
      { title: 'Understanding roast levels', url: 'https://roasters.example.net/roasts', description: 'The flavour differences between light, medium, and dark roasts.' },
    ],
    text: 'Light roasts keep more of the bean’s origin character, so expect brighter acidity and fruity or floral notes. Dark roasts taste bolder and more bitter-sweet, with chocolate and caramel flavours from the roast itself. Caffeine content is nearly the same.',
  },
]

const hour = 60 * 60 * 1000
const loadedAt = Date.now()

const history: ChatHistory[] = [
  { id: 'h1', title: 'Pour-over recipe for two', updatedAt: new Date(loadedAt - 2 * hour), messages: [
    { id: -1, role: 'user', text: 'Suggest a pour-over recipe' },
    { id: -2, role: 'assistant', text: responses[1]!.text, response: 1 },
  ] },
  { id: 'h2', title: 'Light vs dark roast', updatedAt: new Date(loadedAt - 30 * hour), messages: [
    { id: -3, role: 'user', text: 'Compare light and dark roasts' },
    { id: -4, role: 'assistant', text: responses[2]!.text, response: 2 },
  ] },
  { id: 'h3', title: 'Dialing in the new grinder', updatedAt: new Date(loadedAt - 5 * 24 * hour), messages: [
    { id: -5, role: 'user', text: 'How do I dial in espresso?' },
    { id: -6, role: 'assistant', text: responses[0]!.text, response: 0 },
  ] },
]

export default function AiChatPage() {
  const { toast } = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const nextId = useRef(0)
  const [conversations, setConversations] = useState(history)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [pending, setPending] = useState<{ id: number; words: string[] } | null>(null)
  const [responseIndex, setResponseIndex] = useState(0)
  const uploading = attachments.some((attachment) => (attachment.progress ?? 100) < 100)
  const active = conversations.find((conversation) => conversation.id === activeId)

  useEffect(() => {
    if (!pending) return
    let count = 0
    let interval: ReturnType<typeof setInterval> | undefined
    const delay = setTimeout(() => {
      interval = setInterval(() => {
        count += 1
        setMessages((current) => current.map((message) => message.id === pending.id ? { ...message, text: pending.words.slice(0, count).join(' ') } : message))
        if (count >= pending.words.length) setPending(null)
      }, 40)
    }, 700)
    return () => {
      clearTimeout(delay)
      clearInterval(interval)
    }
  }, [pending])

  useEffect(() => {
    if (!uploading) return
    const timer = setInterval(() => {
      setAttachments((current) => current.map((attachment) => (attachment.progress ?? 100) < 100 ? { ...attachment, progress: Math.min(100, attachment.progress! + 20) } : attachment))
    }, 250)
    return () => clearInterval(timer)
  }, [uploading])

  function respond(id: number) {
    const response = responseIndex % responses.length
    setMessages((current) => current.map((message) => message.id === id ? { ...message, text: '', response } : message))
    setPending({ id, words: responses[response]!.text.split(' ') })
    setResponseIndex((index) => index + 1)
  }

  function send(text: string) {
    nextId.current += 2
    const id = nextId.current
    const sent = attachments.map((attachment) => ({ ...attachment, progress: undefined }))
    setMessages((current) => [...current, { id: id - 1, role: 'user', text, attachments: sent }, { id, role: 'assistant', text: '' }])
    setAttachments([])
    if (!activeId) {
      const conversation = { id: `c${id}`, title: text.length > 40 ? `${text.slice(0, 40)}…` : text, updatedAt: new Date(), messages: [] }
      setConversations((current) => [conversation, ...current])
      setActiveId(conversation.id)
    }
    respond(id)
  }

  function stop() {
    setPending(null)
    setMessages((current) => current.filter((message) => message.role === 'user' || message.text))
  }

  function saveActive() {
    const kept = messages.filter((message) => message.role === 'user' || message.text)
    if (activeId) setConversations((current) => current.map((conversation) => conversation.id === activeId ? { ...conversation, messages: kept } : conversation))
  }

  function open(id: string | null) {
    if (id === activeId) return
    setPending(null)
    saveActive()
    setActiveId(id)
    setMessages(conversations.find((conversation) => conversation.id === id)?.messages ?? [])
  }

  function remove(id: string) {
    if (id === activeId) {
      setPending(null)
      setActiveId(null)
      setMessages([])
    }
    setConversations((current) => current.filter((conversation) => conversation.id !== id))
  }

  function attach(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    setAttachments((current) => [...current, ...files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
    }))])
  }

  function removeAttachment(id: string) {
    const attachment = attachments.find((item) => item.id === id)
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    setAttachments((current) => current.filter((item) => item.id !== id))
  }

  const chat = messages.length ? (
    <MessageList label="Conversation" aria-busy={pending !== null} className="min-h-0 flex-1">
      {messages.map((message) => {
        const streaming = pending?.id === message.id
        if (message.role === 'user') {
          return (
            <div key={message.id} className="flex flex-col items-end gap-1.5">
              {message.attachments?.length ? <AttachmentList attachments={message.attachments} label="Attached files" className="justify-end" /> : null}
              <ChatMessage author="You" variant="outgoing" className="w-full">{message.text}</ChatMessage>
            </div>
          )
        }
        const response = responses[message.response ?? 0]!
        const thinking = streaming && !message.text
        return (
          <div key={message.id} className="mt-1 space-y-2 first:mt-0">
            <div className="ml-9 max-w-[80%] space-y-2">
              <Reasoning streaming={thinking} duration={2}>{response.reasoning}</Reasoning>
              {response.tool && <ToolCall name={response.tool.name} status={thinking ? 'running' : 'success'} input={response.tool.input} output={response.tool.output} />}
            </div>
            <ChatMessage author="Barista AI">
              {message.text
                ? <>{message.text}{streaming && <TypingIndicator variant="cursor" label="Barista AI is responding" />}</>
                : <TypingIndicator label="Barista AI is thinking" />}
            </ChatMessage>
            {!streaming && <Sources sources={response.sources} className="ml-9" />}
            {!streaming && (
              <MessageActions
                content={message.text}
                className="ml-9"
                onRegenerate={pending ? undefined : () => respond(message.id)}
                onFeedbackChange={(feedback) => { if (feedback) toast({ title: 'Thanks for the feedback', variant: 'success' }) }}
              />
            )}
          </div>
        )
      })}
    </MessageList>
  ) : (
    <div className="flex min-h-0 flex-1 items-center justify-center p-6">
      <EmptyState
        icon={<Sparkles strokeWidth={1.5} />}
        title="What are we brewing today?"
        description="Ask about recipes, grind settings, or beans. Responses in this demo are simulated."
        className="border-0"
        action={<Suggestions suggestions={suggestions} onSelect={send} className="justify-center" />}
      />
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-5xl space-y-5">
      <ExampleHeader title="AI chat" description="An assistant chat with history, attachments, suggested prompts, visible reasoning and tool calls, streaming responses you can stop, cited sources, and feedback." />
      <div className="flex h-[40rem] overflow-hidden rounded-panel border border-border bg-surface shadow-xs">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border sm:flex">
          <div className="p-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => open(null)}><SquarePen aria-hidden="true" className="size-3.5" strokeWidth={1.5} />New chat</Button>
          </div>
          <ScrollArea label="Chat history" className="min-h-0 flex-1 px-2 pb-2">
            <ConversationList
              label="Chat history"
              conversations={conversations}
              selectedId={activeId}
              onSelect={open}
              getActions={(conversation) => [
                { label: 'Delete', icon: <Trash2 strokeWidth={1.5} />, destructive: true, onSelect: () => remove(conversation.id) },
              ]}
            />
          </ScrollArea>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <h2 className="truncate text-sm font-semibold">{active?.title ?? 'Barista AI'}</h2>
            <Badge variant="outline" dot className="shrink-0">Online</Badge>
            <div className="ml-auto sm:hidden">
              <Tooltip content="New chat">
                <IconButton aria-label="New chat" size="sm" disabled={!messages.length} onClick={() => open(null)}><SquarePen strokeWidth={1.5} /></IconButton>
              </Tooltip>
            </div>
          </header>
          {chat}
          <div className="p-3 pt-0">
            <input ref={fileInput} type="file" multiple hidden onChange={attach} />
            <PromptInput
              label="Message Barista AI"
              placeholder="Ask about coffee…"
              loading={pending !== null}
              onSubmit={send}
              onStop={stop}
              header={<AttachmentList attachments={attachments} onRemove={removeAttachment} className="px-1 pt-1" />}
              actions={<Tooltip content="Attach files"><IconButton aria-label="Attach files" size="sm" onClick={() => fileInput.current?.click()}><Paperclip strokeWidth={1.5} /></IconButton></Tooltip>}
            />
            <p className="mt-2 text-center text-xs text-muted">Barista AI can make mistakes. Check important brewing advice.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
