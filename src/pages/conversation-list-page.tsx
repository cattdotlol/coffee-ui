import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { ConversationList } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { ConversationList } from '@catpkgs/coffee-ui'

<ConversationList
  conversations={conversations}
  selectedId={activeId}
  onSelect={setActiveId}
  getActions={(conversation) => [
    { label: 'Rename', icon: <Pencil />, onSelect: () => rename(conversation.id) },
    { label: 'Delete', icon: <Trash2 />, destructive: true, onSelect: () => remove(conversation.id) },
  ]}
/>`

const hour = 60 * 60 * 1000
const now = Date.now()
const initial = [
  { id: '1', title: 'Dialing in the new Ethiopian beans', updatedAt: new Date(now - hour) },
  { id: '2', title: 'Cold brew ratio for 2 litres', updatedAt: new Date(now - 3 * hour) },
  { id: '3', title: 'Grinder burr replacement', updatedAt: new Date(now - 26 * hour) },
  { id: '4', title: 'Holiday menu ideas', updatedAt: new Date(now - 4 * 24 * hour) },
  { id: '5', title: 'Oat milk steaming tips', updatedAt: new Date(now - 12 * 24 * hour) },
  { id: '6', title: 'Café opening checklist', updatedAt: new Date(now - 60 * 24 * hour) },
]

export default function ConversationListPage() {
  const [conversations, setConversations] = useState(initial)
  const [selectedId, setSelectedId] = useState<string | null>('1')
  return (
    <PrimitivePage title="ConversationList" description="Chat history grouped into Today, Yesterday, Previous 7 days, Previous 30 days, and then by month. Each conversation can have its own actions menu, shown on hover or focus." code={code}>
      <div className="max-w-64 rounded-panel border border-border bg-surface p-2">
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          getActions={(conversation) => [
            { label: 'Rename', icon: <Pencil strokeWidth={1.5} />, onSelect: () => setConversations((current) => current.map((item) => item.id === conversation.id ? { ...item, title: `${item.title} (renamed)` } : item)) },
            { label: 'Delete', icon: <Trash2 strokeWidth={1.5} />, destructive: true, separatorBefore: true, onSelect: () => setConversations((current) => current.filter((item) => item.id !== conversation.id)) },
          ]}
        />
      </div>
    </PrimitivePage>
  )
}
