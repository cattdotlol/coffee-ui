import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, CalendarDays, Ellipsis, Plus, Trash2 } from 'lucide-react'
import {
  Avatar, AvatarGroup, Badge, Button, Checkbox, DatePicker, Dialog, DropdownMenu, IconButton, InlineEdit, MultiSelect, Progress,
  SearchField, Select, Sheet, Tag, Textarea, TextField, Timeline, ToggleGroup, useToast,
} from '@catpkgs/coffee-ui'
import ExampleHeader from './example-header.tsx'

const columns = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'progress', label: 'In progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
] as const

type Status = (typeof columns)[number]['id']
type Task = { id: string; title: string; status: Status; labels: string[]; assignee: string; due: Date | null; description: string; checklist: { label: string; done: boolean }[] }

const labelOptions = [
  { value: 'Menu', label: 'Menu' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Ops', label: 'Ops' },
]
const people = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson']
const inDays = (days: number) => new Date(Date.now() + days * 86_400_000)
const dueFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

const initialTasks: Task[] = [
  { id: 't1', title: 'Design autumn seasonal menu', status: 'progress', labels: ['Menu', 'Marketing'], assignee: 'Grace Hopper', due: inDays(3), description: 'Three new drinks and one pastry. Coordinate with the roaster on the Ethiopian lot.', checklist: [{ label: 'Shortlist drinks', done: true }, { label: 'Cost each recipe', done: true }, { label: 'Staff tasting', done: false }, { label: 'Photograph menu', done: false }] },
  { id: 't2', title: 'Service Riverside grinder', status: 'backlog', labels: ['Equipment'], assignee: 'Alan Turing', due: inDays(6), description: 'Burrs are drifting two steps. Book the technician.', checklist: [{ label: 'Call technician', done: false }] },
  { id: 't3', title: 'Launch loyalty program emails', status: 'review', labels: ['Marketing'], assignee: 'Katherine Johnson', due: inDays(1), description: 'Welcome series plus a birthday reward.', checklist: [{ label: 'Write copy', done: true }, { label: 'Design templates', done: true }, { label: 'Legal review', done: false }] },
  { id: 't4', title: 'Update allergen labels', status: 'done', labels: ['Ops', 'Menu'], assignee: 'Ada Lovelace', due: inDays(-2), description: 'Oat and almond milk labels for all locations.', checklist: [{ label: 'Print labels', done: true }, { label: 'Distribute', done: true }] },
  { id: 't5', title: 'Hire weekend barista', status: 'backlog', labels: ['Ops'], assignee: 'Ada Lovelace', due: null, description: '', checklist: [] },
  { id: 't6', title: 'Cold brew keg setup', status: 'progress', labels: ['Equipment', 'Menu'], assignee: 'Alan Turing', due: inDays(-1), description: 'Nitro tap for the Downtown bar.', checklist: [{ label: 'Order kegerator', done: true }, { label: 'Install tap', done: false }] },
]

function TaskCard({ task, onOpen, onMove, onDelete }: { task: Task; onOpen: () => void; onMove: (status: Status) => void; onDelete: () => void }) {
  const done = task.checklist.filter((item) => item.done).length
  const overdue = task.due && task.status !== 'done' && task.due < new Date()
  return (
    <div className="group relative rounded-inner border border-border bg-surface p-3 shadow-xs motion-safe:transition-shadow hover:shadow-sm">
      <div className="mb-2 flex flex-wrap gap-1 pr-7">{task.labels.map((label) => <Tag key={label} variant="primary">{label}</Tag>)}</div>
      <button type="button" onClick={onOpen} className="block w-full cursor-pointer text-left text-sm font-medium after:absolute after:inset-0 after:rounded-inner focus-visible:outline-none focus-visible:after:shadow-[inset_0_0_0_2px_var(--color-primary)]">
        {task.title}
      </button>
      {task.checklist.length > 0 && <Progress label={`${task.title} checklist`} hideLabel value={(done / task.checklist.length) * 100} className="mt-2.5" />}
      <div className="mt-2.5 flex items-center justify-between gap-2 text-xs text-muted">
        <span className={`flex items-center gap-1 ${overdue ? 'font-medium text-danger' : ''}`}>
          {task.due && <><CalendarDays aria-hidden="true" className="size-3.5" strokeWidth={1.5} />{overdue ? 'Overdue · ' : ''}{dueFormat.format(task.due)}</>}
        </span>
        <span className="flex items-center gap-2">
          {task.checklist.length > 0 && <span className="tabular-nums">{done}/{task.checklist.length}</span>}
          <Avatar alt={task.assignee} size="sm" />
        </span>
      </div>
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu align="end" trigger={<IconButton aria-label={`Actions for ${task.title}`} size="sm"><Ellipsis strokeWidth={1.5} /></IconButton>} items={[
          ...columns.filter((column) => column.id !== task.status).map((column) => ({ label: `Move to ${column.label}`, icon: <ArrowRight strokeWidth={1.5} />, onSelect: () => onMove(column.id) })),
          { label: 'Delete', icon: <Trash2 strokeWidth={1.5} />, destructive: true, separatorBefore: true, onSelect: onDelete },
        ]} />
      </div>
    </div>
  )
}

export default function BoardPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState(initialTasks)
  const [query, setQuery] = useState('')
  const [labels, setLabels] = useState<string[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [draft, setDraft] = useState({ title: '', status: 'backlog' as Status, labels: [] as string[], due: null as Date | null })
  const [draftError, setDraftError] = useState<string>()
  const open = tasks.find((task) => task.id === openId)
  const visible = tasks.filter((task) => task.title.toLowerCase().includes(query.trim().toLowerCase()) && labels.every((label) => task.labels.includes(label)))

  const update = (id: string, changes: Partial<Task>) => setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...changes } : task)))

  function remove(task: Task) {
    setTasks((current) => current.filter((item) => item.id !== task.id))
    toast({ title: `Deleted “${task.title}”`, action: { label: 'Undo', onClick: () => setTasks((current) => [...current, task]) } })
  }

  function create(close: () => void) {
    if (!draft.title.trim()) {
      setDraftError('Give the task a title.')
      return
    }
    setTasks([...tasks, { id: crypto.randomUUID(), title: draft.title.trim(), status: draft.status, labels: draft.labels, assignee: 'Ada Lovelace', due: draft.due, description: '', checklist: [] }])
    setDraft({ title: '', status: 'backlog', labels: [], due: null })
    setDraftError(undefined)
    close()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-6xl space-y-5">
      <ExampleHeader
        title="Project board"
        description="A kanban board with search, label filters, keyboard-friendly moves from each card’s menu, a details sheet with an editable checklist, and a new-task dialog."
        actions={<>
          <AvatarGroup label="Team" avatars={people.map((alt) => ({ alt }))} max={3} size="sm" />
          <Dialog
            trigger={<Button size="sm"><Plus aria-hidden="true" className="size-3.5" strokeWidth={1.5} />New task</Button>}
            title="New task"
            footer={({ close }) => <><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={() => create(close)}>Create task</Button></>}
          >
            <div className="space-y-3">
              <TextField label="Title" required value={draft.title} onValueChange={(title) => { setDraft({ ...draft, title }); setDraftError(undefined) }} error={draftError} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select label="Status" value={draft.status} onValueChange={(status) => setDraft({ ...draft, status: status as Status })} options={columns.map((column) => ({ value: column.id, label: column.label }))} />
                <DatePicker label="Due date" value={draft.due} onValueChange={(due) => setDraft({ ...draft, due })} />
              </div>
              <MultiSelect label="Labels" placeholder="Add labels" options={labelOptions} value={draft.labels} onValueChange={(value) => setDraft({ ...draft, labels: value })} />
            </div>
          </Dialog>
        </>}
      />

      <div role="group" aria-label="Filters" className="flex flex-wrap items-center gap-2">
        <div className="w-60"><SearchField label="Search tasks" hideLabel placeholder="Search tasks…" value={query} onValueChange={setQuery} /></div>
        <ToggleGroup label="Filter by label" value={labels} onValueChange={setLabels} items={labelOptions} />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = visible.filter((task) => task.status === column.id)
          return (
            <section key={column.id} aria-labelledby={`column-${column.id}`} className="flex min-h-40 flex-col rounded-panel bg-subtle/70 p-2">
              <header className="mb-2 flex items-center justify-between px-1.5 pt-1">
                <h2 id={`column-${column.id}`} className="text-sm font-semibold">{column.label}</h2>
                <Badge variant="outline">{columnTasks.length}</Badge>
              </header>
              <ul className="flex flex-1 flex-col gap-2">
                {columnTasks.map((task) => (
                  <motion.li key={task.id} layout>
                    <TaskCard task={task} onOpen={() => { setOpenId(task.id); setSheetOpen(true) }} onMove={(status) => update(task.id, { status })} onDelete={() => remove(task)} />
                  </motion.li>
                ))}
                {!columnTasks.length && <li className="flex flex-1 items-center justify-center rounded-inner border border-dashed border-border p-4 text-xs text-muted">No tasks</li>}
              </ul>
            </section>
          )
        })}
      </div>

      <Sheet open={sheetOpen && !!open} onOpenChange={setSheetOpen} title="Task details" description={open ? `In ${columns.find((column) => column.id === open.status)?.label}` : undefined}>
        {open && (
          <div className="space-y-5">
            <div className="text-base font-semibold"><InlineEdit label="Task title" value={open.title} onValueChange={(title) => update(open.id, { title })} validate={(value) => (value.trim() ? null : 'Title is required.')} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Status" value={open.status} onValueChange={(status) => update(open.id, { status: status as Status })} options={columns.map((column) => ({ value: column.id, label: column.label }))} />
              <Select label="Assignee" value={open.assignee} onValueChange={(assignee) => update(open.id, { assignee })} options={people.map((person) => ({ value: person, label: person }))} />
            </div>
            <Textarea label="Description" rows={3} placeholder="Add more detail…" value={open.description} onValueChange={(description) => update(open.id, { description })} />
            {open.checklist.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-medium">Checklist</p>
                {open.checklist.map((item, index) => (
                  <Checkbox key={item.label} label={item.label} checked={item.done} onCheckedChange={(checked) => update(open.id, { checklist: open.checklist.map((entry, position) => (position === index ? { ...entry, done: checked } : entry)) })} />
                ))}
              </div>
            )}
            <div>
              <p className="mb-2 text-sm font-medium">Activity</p>
              <Timeline items={[
                { title: `Moved to ${columns.find((column) => column.id === open.status)?.label}`, time: 'Today', active: true },
                { title: `Assigned to ${open.assignee}`, time: 'Mon' },
                { title: 'Task created', time: 'Sep 10' },
              ]} />
            </div>
          </div>
        )}
      </Sheet>
    </motion.div>
  )
}
