'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/tabs'
import { NotificationSettings } from '@/src/components/organisms/NotificationSettings'
import { ThemeEditor } from '@/src/components/organisms/ThemeEditor'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useState, useEffect } from 'react'
import { Separator } from '@/src/components/ui/separator'
import { toast } from '@/src/hooks/use-toast'

interface SettingsPanelProps {
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

export function SettingsPanel({ theme, onThemeToggle }: SettingsPanelProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({ title: 'Fill in both password fields', variant: 'destructive' })
      return
    }
    if (newPassword.length < 8) {
      toast({ title: 'Password must be at least 8 characters', variant: 'destructive' })
      return
    }
    const res = await fetch('/api/settings/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    })
    const json = await res.json()
    if (json.success) {
      toast({ title: 'Password changed' })
      setCurrentPassword('')
      setNewPassword('')
    } else {
      toast({ title: json.error || 'Failed to change password', variant: 'destructive' })
    }
  }

  const revokeSessions = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' })
    const json = await res.json()
    if (json.success) {
      toast({ title: 'All sessions revoked. Redirecting to login...' })
      setTimeout(() => { window.location.href = '/login' }, 1000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure your Axius OSS instance</p>
      </div>

        <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark</p>
                </div>
                <Button variant="outline" onClick={onThemeToggle}>
                  {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                </Button>
              </div>
              <Separator />
              <ThemeEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button onClick={changePassword}>Change Password</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Active Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Revoke all active sessions. This will log you out.
                </p>
                <Button variant="destructive" onClick={revokeSessions}>
                  Revoke All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
