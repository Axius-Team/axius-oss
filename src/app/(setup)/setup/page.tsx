'use client'

export const dynamic = 'force-dynamic'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import { LoadingSpinner } from '@/src/components/atoms/LoadingSpinner'

export default function SetupPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [step, setStep] = useState(0)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [smtpHost, setSmtpHost] = useState('')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpSecure, setSmtpSecure] = useState(false)
  const [smtpUser, setSmtpUser] = useState('')
  const [smtpPass, setSmtpPass] = useState('')
  const [smtpFrom, setSmtpFrom] = useState('')
  const [smtpFromName, setSmtpFromName] = useState('Axius OSS')
  const [notifyEmail, setNotifyEmail] = useState('')
  const [skipSmtp, setSkipSmtp] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark')
    fetch('/api/setup')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.setupComplete) {
          router.push('/login')
        } else {
          setChecking(false)
        }
      })
      .catch(() => setChecking(false))
  }, [router])

  const handleNext = () => {
    setError('')
    if (step === 0) {
      setStep(1)
    } else if (step === 1) {
      if (username.length < 3) {
        setError('Username must be at least 3 characters')
        return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    setError('')
    setStep(Math.max(0, step - 1))
  }

  const handleFinish = async () => {
    setSaving(true)
    setError('')

    try {
      const body: any = { username, password }
      if (!skipSmtp && smtpHost) {
        body.smtp_host = smtpHost
        body.smtp_port = smtpPort
        body.smtp_secure = smtpSecure
        body.smtp_user = smtpUser
        body.smtp_pass = smtpPass
        body.smtp_from_address = smtpFrom
        body.smtp_from_name = smtpFromName
        body.notification_email = notifyEmail
      }

      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()

      if (json.success) {
        router.push('/login')
      } else {
        setError(json.error || 'Setup failed')
      }
    } catch {
      setError('Setup failed')
    } finally {
      setSaving(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <Image
            src={theme === 'dark' ? '/images/axius-icon-white.png' : '/images/axius-icon-black.png'}
            alt="Axius"
            width={40}
            height={40}
            className="mx-auto"
          />
          <div>
            <h1 className="text-3xl font-bold">Axius OSS</h1>
            <p className="text-muted-foreground">Self-hosted server monitoring for developers</p>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-16 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="rounded-lg border bg-card p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Welcome to Axius OSS</h2>
              <p className="text-muted-foreground">
                Axius OSS is a self-hosted server monitoring dashboard. All your data stays on
                your machine in a local SQLite database. No data ever leaves your server.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Real-time system monitoring</li>
                <li>Docker container management</li>
                <li>File explorer</li>
                <li>Web terminal</li>
                <li>Email notifications</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Let us get you set up in a few steps.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Create Admin User</h2>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password (min 8 characters)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">SMTP Configuration</h2>
                <div className="flex items-center gap-2">
                  <Label htmlFor="skip-smtp" className="text-sm">Skip</Label>
                  <Switch id="skip-smtp" checked={skipSmtp} onCheckedChange={setSkipSmtp} />
                </div>
              </div>

              {!skipSmtp && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Configure email for container stop alerts (optional).
                  </p>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input id="smtp-host" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Port</Label>
                      <Input id="smtp-port" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="smtp-secure" checked={smtpSecure} onCheckedChange={setSmtpSecure} />
                    <Label htmlFor="smtp-secure">Use TLS/SSL</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">SMTP Username</Label>
                    <Input id="smtp-user" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-pass">SMTP Password</Label>
                    <Input id="smtp-pass" type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} />
                  </div>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-from">From Address</Label>
                      <Input id="smtp-from" value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-from-name">From Name</Label>
                      <Input id="smtp-from-name" value={smtpFromName} onChange={(e) => setSmtpFromName(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notify-email">Notification Email</Label>
                    <Input id="notify-email" type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} />
                  </div>
                </div>
              )}

              {skipSmtp && (
                <p className="text-sm text-muted-foreground">
                  You can configure email notifications later in Settings.
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">All Set!</h2>
              <p className="text-muted-foreground">
                You are ready to start using Axius OSS. Click Finish to complete the setup and
                proceed to login.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2 text-green-500">
                  <span>&#10003;</span> Admin user created
                </li>
                <li className="flex items-center gap-2 text-green-500">
                  <span>&#10003;</span> {skipSmtp ? 'SMTP skipped' : 'SMTP configured'}
                </li>
                <li className="flex items-center gap-2 text-green-500">
                  <span>&#10003;</span> Database initialized
                </li>
              </ul>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0 || saving}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Back
          </button>
          {step < 3 ? (
            <Button onClick={handleNext} disabled={saving}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={saving}>
              {saving ? 'Setting up...' : 'Finish Setup'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
