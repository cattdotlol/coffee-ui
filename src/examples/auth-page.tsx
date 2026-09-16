import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CircleCheck, Coffee, KeyRound } from 'lucide-react'
import { Alert, Button, Checkbox, Link, OtpInput, PasswordField, Separator, TextField, useToast } from '@catpkgs/coffee-ui'
import ExampleHeader from './example-header.tsx'

type Screen = 'sign-in' | 'sign-up' | 'verify' | 'done'

function Shell({ title, description, children, footer }: { title: string; description: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="w-full">
      <div className="rounded-panel border border-border bg-surface p-6 shadow-md sm:p-7">
        <div className="mb-5 text-center">
          <span aria-hidden="true" className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm"><Coffee className="size-5" strokeWidth={1.75} /></span>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        {children}
      </div>
      {footer && <p className="mt-4 text-center text-sm text-muted">{footer}</p>}
    </motion.div>
  )
}

export default function AuthPage() {
  const { toast } = useToast()
  const [screen, setScreen] = useState<Screen>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [attempted, setAttempted] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string>()
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!cooldown) return
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const emailError = attempted && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email address.' : undefined

  function go(next: Screen) {
    setScreen(next)
    setError(undefined)
    setAttempted(false)
  }

  function submit(action: () => void, valid: boolean) {
    setAttempted(true)
    setError(undefined)
    if (!valid) return
    setLoading(true)
    setTimeout(() => { setLoading(false); action() }, 800)
  }

  function signIn() {
    submit(() => {
      if (password.length < 8) setError('That email and password don’t match. Passwords here are at least 8 characters.')
      else { go('done'); toast({ title: 'Welcome back', variant: 'success' }) }
    }, /^\S+@\S+\.\S+$/.test(email) && !!password)
  }

  function signUp() {
    submit(() => { go('verify'); setCooldown(30) }, /^\S+@\S+\.\S+$/.test(email) && !!name.trim() && password.length >= 8 && terms)
  }

  function verify(value: string) {
    if (value === '123456') {
      setCodeError(undefined)
      go('done')
      toast({ title: 'Email verified', variant: 'success' })
    } else setCodeError('That code is incorrect. Try 123456.')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-5xl space-y-5">
      <ExampleHeader title="Authentication" description="Sign in, sign up with a password strength hint, one-time code verification with a resend cooldown, and friendly error states. Any 8+ character password signs in; the code is 123456." />
      <div className="flex justify-center rounded-panel border border-border bg-[radial-gradient(circle_at_top,var(--color-primary-soft),transparent_60%)] px-4 py-10 sm:py-14">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait" initial={false}>
            {screen === 'sign-in' && (
              <Shell key="sign-in" title="Welcome back" description="Sign in to manage your coffee shop." footer={<>New here? <Button variant="link" className="min-h-0 px-0 py-0" onClick={() => go('sign-up')}>Create an account</Button></>}>
                <form noValidate className="space-y-3" onSubmit={(event) => { event.preventDefault(); signIn() }}>
                  {error && <Alert variant="destructive" role="alert" title="Couldn’t sign you in">{error}</Alert>}
                  <TextField label="Email" type="email" autoComplete="email" value={email} onValueChange={setEmail} error={emailError} />
                  <PasswordField label="Password" value={password} onValueChange={setPassword} error={attempted && !password ? 'Enter your password.' : undefined} />
                  <div className="flex items-center justify-between gap-3">
                    <Checkbox label="Remember me" defaultChecked />
                    <Link href="#forgot" variant="muted" className="text-sm">Forgot password?</Link>
                  </div>
                  <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
                  <div className="flex items-center gap-3 py-1 text-xs text-muted"><Separator className="flex-1" />or<Separator className="flex-1" /></div>
                  <Button variant="outline" className="w-full" onClick={() => toast({ title: 'Passkeys are a demo here' })}><KeyRound aria-hidden="true" className="size-4" strokeWidth={1.5} />Sign in with a passkey</Button>
                </form>
              </Shell>
            )}
            {screen === 'sign-up' && (
              <Shell key="sign-up" title="Create your account" description="Start a 14-day free trial. No card needed." footer={<>Already have an account? <Button variant="link" className="min-h-0 px-0 py-0" onClick={() => go('sign-in')}>Sign in</Button></>}>
                <form noValidate className="space-y-3" onSubmit={(event) => { event.preventDefault(); signUp() }}>
                  <TextField label="Full name" autoComplete="name" value={name} onValueChange={setName} error={attempted && !name.trim() ? 'Enter your name.' : undefined} />
                  <TextField label="Work email" type="email" autoComplete="email" value={email} onValueChange={setEmail} error={emailError} />
                  <PasswordField label="Password" autoComplete="new-password" showStrength value={password} onValueChange={setPassword} error={attempted && password.length < 8 ? 'Use at least 8 characters.' : undefined} />
                  <Checkbox label="I agree to the terms and privacy policy" checked={terms} onCheckedChange={setTerms} error={attempted && !terms ? 'Please accept the terms to continue.' : undefined} />
                  <Button type="submit" className="w-full" loading={loading}>Create account</Button>
                </form>
              </Shell>
            )}
            {screen === 'verify' && (
              <Shell key="verify" title="Check your email" description={`We sent a 6-digit code to ${email || 'your email'}.`} footer={<Button variant="link" className="min-h-0 px-0 py-0" onClick={() => go('sign-up')}>Use a different email</Button>}>
                <div className="flex flex-col items-center gap-4">
                  <OtpInput label="Verification code" hideLabel value={code} onValueChange={(value) => { setCode(value); setCodeError(undefined) }} onComplete={verify} error={codeError} />
                  <Button variant="ghost" size="sm" disabled={cooldown > 0} onClick={() => { setCooldown(30); toast({ title: 'New code sent' }) }}>
                    {cooldown > 0 ? <span className="tabular-nums">Resend code in {cooldown}s</span> : 'Resend code'}
                  </Button>
                </div>
              </Shell>
            )}
            {screen === 'done' && (
              <Shell key="done" title="You’re all set" description="Your account is ready to go.">
                <div className="flex flex-col items-center gap-4">
                  <CircleCheck aria-hidden="true" className="size-10 text-primary" strokeWidth={1.5} />
                  <Button variant="outline" onClick={() => { go('sign-in'); setPassword(''); setCode('') }}>Back to sign in</Button>
                </div>
              </Shell>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
