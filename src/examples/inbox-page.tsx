import { useState } from 'react'
import { motion } from 'motion/react'
import { Archive, Inbox, Mail, MailOpen, Reply, Star, Trash2 } from 'lucide-react'
import {
  Avatar, Button, ContextMenu, EmptyState, IconButton, Kbd, Resizable, ScrollArea, SearchField, SegmentedControl, Separator,
  Tag, Textarea, Toggle, Toolbar, Tooltip, useToast,
} from '@catpkgs/coffee-ui'
import ExampleHeader from './example-header.tsx'

type Message = {
  id: string
  from: string
  email: string
  subject: string
  body: string[]
  time: string
  unread: boolean
  starred: boolean
  labels: string[]
}

const initialMessages: Message[] = [
  { id: '1', from: 'Grace Hopper', email: 'grace@acme.com', subject: 'New espresso blend tasting', time: '9:41 AM', unread: true, starred: true, labels: ['Tasting'],
    body: ['Hi Ada,', 'The roaster sent over three samples for the autumn blend. Could you join the tasting on Thursday at 10? I would love your notes on the Ethiopian lot in particular.', 'Grace'] },
  { id: '2', from: 'Alan Turing', email: 'alan@acme.com', subject: 'Re: Grinder calibration', time: '8:15 AM', unread: true, starred: false, labels: ['Equipment'],
    body: ['I re-ran the calibration and the burrs were off by two steps. Shots are pulling at 28 seconds again.', 'Alan'] },
  { id: '3', from: 'Northwind Beans', email: 'orders@northwind.com', subject: 'Your order has shipped', time: 'Yesterday', unread: false, starred: false, labels: ['Orders'],
    body: ['Good news! 12 bags of Colombia Huila are on their way and should arrive Friday.', 'Tracking number: NW-448210'] },
  { id: '4', from: 'Katherine Johnson', email: 'katherine@acme.com', subject: 'Weekly numbers', time: 'Yesterday', unread: false, starred: true, labels: ['Reports'],
    body: ['Revenue was up 8% week over week, mostly thanks to the cold brew promo. Full report attached.', 'Katherine'] },
  { id: '5', from: 'Linus Torvalds', email: 'linus@acme.com', subject: 'POS tablet keeps restarting', time: 'Mon', unread: false, starred: false, labels: ['Equipment'],
    body: ['The Riverside tablet restarted four times during the morning rush. I swapped the charger but it is still happening.', 'Linus'] },
  { id: '6', from: 'Margaret Hamilton', email: 'margaret@acme.com', subject: 'Holiday schedule draft', time: 'Sep 12', unread: false, starred: false, labels: ['Team'],
    body: ['Here is a first pass at the December schedule. Let me know if anyone has conflicts before Friday.', 'Margaret'] },
]

export default function InboxPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState(initialMessages)
  const [selectedId, setSelectedId] = useState<string | null>('1')
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all')
  const [query, setQuery] = useState('')
  const [reply, setReply] = useState('')
  const search = query.trim().toLowerCase()
  const visible = messages.filter((message) =>
    (filter === 'all' || (filter === 'unread' ? message.unread : message.starred))
    && (!search || `${message.from} ${message.subject} ${message.body.join(' ')}`.toLowerCase().includes(search)))
  const selected = messages.find((message) => message.id === selectedId)
  const unreadCount = messages.filter((message) => message.unread).length

  function update(id: string, changes: Partial<Message>) {
    setMessages((current) => current.map((message) => (message.id === id ? { ...message, ...changes } : message)))
  }

  function open(id: string) {
    setSelectedId(id)
    update(id, { unread: false })
    setReply('')
  }

  function remove(id: string, verb: 'Archived' | 'Deleted') {
    const index = messages.findIndex((message) => message.id === id)
    const removed = messages[index]
    if (!removed) return
    const remaining = messages.filter((message) => message.id !== id)
    setMessages(remaining)
    if (selectedId === id) setSelectedId(remaining[Math.min(index, remaining.length - 1)]?.id ?? null)
    toast({ title: `${verb} “${removed.subject}”`, action: { label: 'Undo', onClick: () => setMessages((current) => [...current.slice(0, index), removed, ...current.slice(index)]) } })
  }

  function send() {
    if (!selected || !reply.trim()) return
    toast({ title: 'Reply sent', description: `To ${selected.from}`, variant: 'success' })
    setReply('')
  }

  const list = (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b border-border p-3">
        <SearchField label="Search mail" hideLabel placeholder="Search mail…" value={query} onValueChange={setQuery} />
        <SegmentedControl label="Filter messages" value={filter} onValueChange={setFilter} className="w-full [&>button]:flex-1" options={[
          { value: 'all', label: 'All' },
          { value: 'unread', label: unreadCount ? `Unread (${unreadCount})` : 'Unread' },
          { value: 'starred', label: 'Starred' },
        ]} />
      </div>
      <ScrollArea label="Messages" className="min-h-0 flex-1">
        {visible.length ? (
          <ul className="space-y-0.5 p-1.5">
            {visible.map((message) => (
              <li key={message.id}>
                <ContextMenu label={`Actions for ${message.subject}`} items={[
                  { label: message.unread ? 'Mark as read' : 'Mark as unread', icon: message.unread ? <MailOpen strokeWidth={1.5} /> : <Mail strokeWidth={1.5} />, onSelect: () => update(message.id, { unread: !message.unread }) },
                  { label: message.starred ? 'Unstar' : 'Star', icon: <Star strokeWidth={1.5} />, onSelect: () => update(message.id, { starred: !message.starred }) },
                  { label: 'Archive', icon: <Archive strokeWidth={1.5} />, shortcut: 'E', onSelect: () => remove(message.id, 'Archived') },
                  { label: 'Delete', icon: <Trash2 strokeWidth={1.5} />, destructive: true, separatorBefore: true, onSelect: () => remove(message.id, 'Deleted') },
                ]}>
                  <button
                    type="button"
                    aria-current={message.id === selectedId || undefined}
                    onClick={() => open(message.id)}
                    className="group flex w-full cursor-pointer gap-2.5 rounded-inner p-2.5 text-left motion-safe:transition-colors hover:bg-subtle aria-[current=true]:bg-primary-soft"
                  >
                    <Avatar alt={message.from} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className={`min-w-0 flex-1 truncate text-sm ${message.unread ? 'font-semibold' : 'font-medium'}`}>{message.from}</span>
                        <span className="shrink-0 text-xs text-muted">{message.time}</span>
                      </span>
                      <span className={`block truncate text-xs ${message.unread ? 'font-medium text-foreground' : 'text-muted'}`}>{message.subject}</span>
                      <span className="mt-0.5 line-clamp-1 text-xs text-muted">{message.body[1] ?? message.body[0]}</span>
                    </span>
                    <span className="flex w-2 shrink-0 flex-col items-center gap-1 pt-1.5">
                      {message.unread && <span className="size-2 rounded-full bg-primary"><span className="sr-only">Unread</span></span>}
                      {message.starred && <Star aria-label="Starred" className="size-3 fill-current text-primary" strokeWidth={1.5} />}
                    </span>
                  </button>
                </ContextMenu>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-3"><EmptyState icon={<Inbox strokeWidth={1.5} />} title="No messages" description={search ? 'Nothing matches your search.' : 'You’re all caught up.'} /></div>
        )}
      </ScrollArea>
    </div>
  )

  const reader = selected ? (
    <article aria-labelledby="message-subject" className="flex h-full flex-col">
      <Toolbar label="Message actions" className="m-3 mb-0 self-start">
        <Tooltip content="Archive"><IconButton aria-label="Archive" size="sm" onClick={() => remove(selected.id, 'Archived')}><Archive strokeWidth={1.5} /></IconButton></Tooltip>
        <Tooltip content="Delete"><IconButton aria-label="Delete" size="sm" onClick={() => remove(selected.id, 'Deleted')}><Trash2 strokeWidth={1.5} /></IconButton></Tooltip>
        <Separator orientation="vertical" className="mx-0.5 h-4 self-center" />
        <Tooltip content="Mark as unread"><IconButton aria-label="Mark as unread" size="sm" onClick={() => update(selected.id, { unread: true })}><Mail strokeWidth={1.5} /></IconButton></Tooltip>
        <Toggle aria-label="Star" size="sm" className="ui-icon-button" pressed={selected.starred} onPressedChange={(starred) => update(selected.id, { starred })}>
          <Star aria-hidden="true" className={`size-4 ${selected.starred ? 'fill-current text-primary' : ''}`} strokeWidth={1.5} />
        </Toggle>
      </Toolbar>
      <ScrollArea label="Message" className="min-h-0 flex-1 px-5 py-4">
        <h2 id="message-subject" className="text-lg font-semibold tracking-tight">{selected.subject}</h2>
        <div className="mt-1.5 flex flex-wrap gap-1">{selected.labels.map((label) => <Tag key={label} variant="primary">{label}</Tag>)}</div>
        <div className="mt-4 flex items-center gap-2.5">
          <Avatar alt={selected.from} />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium">{selected.from}</p>
            <p className="truncate text-xs text-muted">{selected.email}</p>
          </div>
          <time className="text-xs text-muted">{selected.time}</time>
        </div>
        <Separator className="my-4" />
        <div className="space-y-3 text-sm leading-6">{selected.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      </ScrollArea>
      <form className="border-t border-border p-3" onSubmit={(event) => { event.preventDefault(); send() }}>
        <Textarea
          label={`Reply to ${selected.from}`}
          hideLabel
          rows={2}
          placeholder={`Reply to ${selected.from.split(' ')[0]}…`}
          value={reply}
          onValueChange={setReply}
          onKeyDown={(event) => { if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); send() } }}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-muted"><Kbd>⌘</Kbd> <Kbd>↵</Kbd> to send</p>
          <Button type="submit" size="sm" disabled={!reply.trim()}><Reply aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Send</Button>
        </div>
      </form>
    </article>
  ) : (
    <div className="flex h-full items-center justify-center p-6">
      <EmptyState icon={<Mail strokeWidth={1.5} />} title="No message selected" description="Choose a message from the list to read it here." className="border-0" />
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-5xl space-y-5">
      <ExampleHeader title="Inbox" description="A two-pane mail app with search, filters, right-click actions, undoable archive, a toolbar, and a keyboard-friendly reply box. Drag the divider to resize." />
      <Resizable label="Resize message list" defaultSize={40} minSize={30} maxSize={60} className="h-[38rem] bg-surface shadow-xs" start={list} end={reader} />
    </motion.div>
  )
}
