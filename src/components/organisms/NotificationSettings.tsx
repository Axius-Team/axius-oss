'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { SmtpStatusBanner } from '@/src/components/molecules/SmtpStatusBanner'
import { toast } from '@/src/hooks/use-toast'

export function NotificationSettings() {
  const [smtpHost, setSmtpHost] = useState('')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpSecure, setSmtpSecure] = useState(false)
  const [smtpUser, setSmtpUser] = useState('')
  const [smtpPass, setSmtpPass] = useState('')
  const [smtpFromAddress, setSmtpFromAddress] = useState('')
  const [smtpFromName, setSmtpFromName] = useState('Axius OSS')
  const [notificationEmail, setNotificationEmail] = useState('')
  const [configured, setConfigured] = useState(false)
  const [connected, setConnected] = useState(false)
  const [testEmailLoading, setTestEmailLoading] = useState(false)

  useEffect(() => {
    fetch('/api/notifications/settings')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) {
          setSmtpHost(json.data.smtp_host || '')
          setSmtpPort(json.data.smtp_port || '587')
          setSmtpSecure(json.data.smtp_secure || false)
          setSmtpUser(json.data.smtp_user || '')
          setSmtpFromAddress(json.data.smtp_from_address || '')
          setSmtpFromName(json.data.smtp_from_name || 'Axius OSS')
          setNotificationEmail(json.data.notification_email || '')
          setConfigured(json.data.smtpConfigured)
          setConnected(json.data.smtpConnected)
        }
      })
      .catch(() => {})
  }, [])

  const saveSmtp = async () => {
    const res = await fetch('/api/notifications/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_secure: smtpSecure,
        smtp_user: smtpUser,
        smtp_pass: smtpPass,
        smtp_from_address: smtpFromAddress,
        smtp_from_name: smtpFromName,
        notification_email: notificationEmail,
      }),
    })
    const json = await res.json()
    if (json.success) {
      toast({ title: 'SMTP settings saved' })
      setConnected(json.data?.connected || false)
      setConfigured(true)
    } else {
      toast({ title: json.error || 'Failed to save', variant: 'destructive' })
    }
  }

  const testEmail = async () => {
    setTestEmailLoading(true)
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: notificationEmail }),
      })
      const json = await res.json()
      if (json.success) {
        toast({ title: 'Test email sent!' })
      } else {
        toast({ title: json.error || 'Failed to send test email', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Failed to send test email', variant: 'destructive' })
    } finally {
      setTestEmailLoading(false)
    }
  }

  const verifySmtp = async () => {
    const res = await fetch('/api/notifications/smtp-verify')
    const json = await res.json()
    if (json.success) {
      setConnected(json.data?.connected || false)
      toast({ title: json.data?.connected ? 'SMTP connected' : 'SMTP not connected' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SmtpStatusBanner configured={configured} connected={connected} />

        <div className="grid gap-4 grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="smtp-host">SMTP Host</Label>
            <Input id="smtp-host" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-port">SMTP Port</Label>
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
          <Input id="smtp-pass" type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} placeholder="Leave empty to keep current" />
        </div>

        <div className="grid gap-4 grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="smtp-from">From Address</Label>
            <Input id="smtp-from" value={smtpFromAddress} onChange={(e) => setSmtpFromAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-from-name">From Name</Label>
            <Input id="smtp-from-name" value={smtpFromName} onChange={(e) => setSmtpFromName(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notification-email">Notification Email</Label>
          <Input id="notification-email" type="email" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <Button onClick={saveSmtp}>Save SMTP Settings</Button>
          <Button variant="outline" onClick={verifySmtp}>Verify Connection</Button>
          <Button variant="secondary" onClick={testEmail} disabled={testEmailLoading}>
            {testEmailLoading ? 'Sending...' : 'Send Test Email'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
