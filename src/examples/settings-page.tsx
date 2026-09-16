import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AtSign, Laptop, LogOut, Smartphone, Sparkles } from 'lucide-react'
import {
  AlertDialog, Avatar, Badge, Banner, Button, Card, Combobox, Fieldset, PasswordField, RadioGroup, Select, Switch,
  Table, Tabs, TextField, Textarea, useToast,
} from '@catpkgs/coffee-ui'
import ExampleHeader from './example-header.tsx'

const timezones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Australia/Sydney']
  .map((zone) => ({ value: zone, label: zone.replace('_', ' ') }))

const initialProfile = { name: 'Ada Lovelace', email: 'ada@acme.com', bio: 'Analytical engine enthusiast and morning pour-over person.', timezone: 'Europe/London', language: 'en' }

type Session = { id: string; device: string; location: string; lastActive: string; current?: boolean; mobile?: boolean }

function Profile() {
  const { toast } = useToast()
  const [saved, setSaved] = useState(initialProfile)
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)
  const dirty = JSON.stringify(saved) !== JSON.stringify(profile)
  const emailError = /^\S+@\S+\.\S+$/.test(profile.email) ? undefined : 'Enter a valid email address.'
  const set = <K extends keyof typeof profile>(key: K, value: (typeof profile)[K]) => setProfile({ ...profile, [key]: value })

  function save() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(profile)
      toast({ title: 'Profile saved', description: 'Your changes are visible to your team.', variant: 'success' })
    }, 700)
  }

  return (
    <div className="space-y-4">
      <Card title="Profile" description="How you appear to people in your workspace.">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Avatar alt={profile.name || 'Unnamed'} size="lg" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Upload photo</Button>
              <Button variant="ghost" size="sm">Remove</Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Full name" autoComplete="name" required value={profile.name} onValueChange={(value) => set('name', value)} />
            <TextField label="Email" type="email" autoComplete="email" required leading={<AtSign strokeWidth={1.5} />} value={profile.email} onValueChange={(value) => set('email', value)} error={emailError} />
          </div>
          <Textarea label="Bio" rows={3} maxLength={160} value={profile.bio} onValueChange={(value) => set('bio', value)} hint={`${profile.bio.length}/160 characters`} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Combobox label="Timezone" options={timezones} value={profile.timezone} onValueChange={(value) => set('timezone', value)} />
            <Select label="Language" value={profile.language} onValueChange={(value) => set('language', value)} options={[{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }, { value: 'bn', label: 'বাংলা' }]} />
          </div>
        </div>
      </Card>
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-control border border-border bg-surface py-1.5 pr-1.5 pl-4 shadow-lg"
          >
            <p role="status" className="text-sm">You have unsaved changes</p>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="sm" disabled={saving} onClick={() => setProfile(saved)}>Discard</Button>
              <Button size="sm" loading={saving} disabled={!!emailError || !profile.name.trim()} onClick={save}>Save changes</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Notifications() {
  return (
    <Card title="Notifications" description="Choose what we email you about.">
      <div className="space-y-5">
        <Fieldset legend="Activity">
          <div className="divide-y divide-border">
            <Switch label="Order updates" hint="When an order is ready or refunded." defaultChecked />
            <Switch label="Mentions" hint="When someone mentions you in a note." defaultChecked />
            <Switch label="Low stock alerts" hint="When a bean runs below two days of supply." />
          </div>
        </Fieldset>
        <RadioGroup label="Summary email" name="digest" defaultValue="weekly" options={[
          { value: 'daily', label: 'Daily', hint: 'Every morning at 8 AM.' },
          { value: 'weekly', label: 'Weekly', hint: 'Mondays, with last week’s numbers.' },
          { value: 'never', label: 'Never' },
        ]} />
      </div>
    </Card>
  )
}

function Security() {
  const { toast } = useToast()
  const [sessions, setSessions] = useState<Session[]>([
    { id: 'mac', device: 'MacBook Pro · Safari', location: 'London, UK', lastActive: 'Active now', current: true },
    { id: 'phone', device: 'iPhone · Coffee UI app', location: 'London, UK', lastActive: '2 hours ago', mobile: true },
    { id: 'office', device: 'Windows · Chrome', location: 'Berlin, DE', lastActive: '3 days ago' },
  ])
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="space-y-4">
      <Card title="Password" description="Use a long passphrase you don't use anywhere else." footer={<Button size="sm" onClick={() => toast({ title: 'Password updated', variant: 'success' })}>Update password</Button>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField label="Current password" />
          <PasswordField label="New password" autoComplete="new-password" showStrength />
        </div>
      </Card>
      <Card title="Two-factor authentication" description="Add a second step when signing in on a new device.">
        <Switch label={twoFactor ? 'Enabled with an authenticator app' : 'Disabled'} checked={twoFactor} onCheckedChange={setTwoFactor} />
      </Card>
      <Card title="Sessions" description="Devices currently signed in to your account.">
        <Table
          caption="Active sessions"
          className="-mx-1 border-0"
          rows={sessions}
          getRowKey={(session) => session.id}
          columns={[
            {
              key: 'device', header: 'Device', cell: (session) => (
                <span className="flex items-center gap-2">
                  {session.mobile ? <Smartphone aria-hidden="true" className="size-4 text-muted" strokeWidth={1.5} /> : <Laptop aria-hidden="true" className="size-4 text-muted" strokeWidth={1.5} />}
                  <span>
                    <span className="block font-medium">{session.device}</span>
                    <span className="block text-xs text-muted">{session.location}</span>
                  </span>
                </span>
              )
            },
            { key: 'active', header: 'Last active', cell: (session) => session.current ? <Badge dot>This device</Badge> : <span className="text-muted">{session.lastActive}</span> },
            {
              key: 'action', header: 'Actions', align: 'end', cell: (session) => session.current ? null : (
                <Button variant="ghost" size="sm" onClick={() => setSessions(sessions.filter((item) => item.id !== session.id))}>
                  <LogOut aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Sign out<span className="sr-only"> {session.device}</span>
                </Button>
              )
            },
          ]}
        />
      </Card>
      <section aria-labelledby="danger-heading" className="rounded-panel border border-danger/40 bg-surface p-5">
        <h3 id="danger-heading" className="text-base font-semibold text-danger">Delete account</h3>
        <p className="mt-1 text-sm leading-5 text-muted">Permanently remove your account and all of its data. This can't be undone.</p>
        <div className="mt-4">
          <AlertDialog
            trigger={<Button variant="destructive" size="sm">Delete account</Button>}
            title="Delete your account?"
            description="All orders, reports, and team access will be removed permanently."
            confirmLabel="Delete account"
            destructive
            onConfirm={() => new Promise<void>((resolve) => setTimeout(() => { toast({ title: 'This is a demo', description: 'Nothing was deleted.' }); resolve() }, 800))}
          />
        </div>
      </section>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-3xl space-y-5">
      <ExampleHeader title="Settings" description="An account settings screen with a profile form, unsaved-changes bar, notification preferences, sessions, and a guarded delete." />
      <Banner icon={<Sparkles strokeWidth={1.5} />} title="Your trial ends in 5 days." action={<Button size="sm" variant="outline">Choose a plan</Button>} dismissible>
        Keep your reports and team access.
      </Banner>
      <Tabs label="Settings sections" items={[
        { value: 'profile', label: 'Profile', content: <Profile /> },
        { value: 'notifications', label: 'Notifications', content: <Notifications /> },
        { value: 'security', label: 'Security', content: <Security /> },
      ]} />
    </motion.div>
  )
}
