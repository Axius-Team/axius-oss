import { NextResponse } from 'next/server'
import Docker from 'dockerode'
import { getDb } from '@/src/lib/db/client'
import { getSetting } from '@/src/lib/db/settings'
import { createTransporter, getFromAddress, getFromName, getNotificationEmail } from '@/src/lib/email/service'
import { renderContainerStoppedEmail } from '@/src/lib/email/templates/container-stopped'
import { checkEmailRateLimit } from '@/src/lib/email/rate-limit'

const docker = new Docker()
let MONITORING_INTERVAL: ReturnType<typeof setInterval> | null = null

export async function GET() {
  if (MONITORING_INTERVAL) {
    return NextResponse.json({ success: true, data: { running: true } })
  }

  MONITORING_INTERVAL = setInterval(async () => {
    try {
      const containers = await docker.listContainers({ all: true })
      const db = getDb()
      const rules = db.prepare('SELECT * FROM notification_rules WHERE enabled = 1').all() as any[]

      for (const rule of rules) {
        const container = containers.find((c: any) => c.Id === rule.container_id)
        if (!container) continue

        const currentStatus = container.State
        const lastKnown = rule.last_known_status

        if (lastKnown === 'running' && currentStatus !== 'running') {
          const email = getNotificationEmail()
          const smtpHost = getSetting('smtp_host')

          if (email && smtpHost && checkEmailRateLimit()) {
            try {
              const transporter = createTransporter()
              const hostname = require('os').hostname()

              await transporter.sendMail({
                from: `"${getFromName()}" <${getFromAddress()}>`,
                to: email,
                subject: `Container Stopped: ${rule.container_name}`,
                html: renderContainerStoppedEmail({
                  containerName: rule.container_name,
                  containerId: rule.container_id,
                  serverHost: rule.server_host,
                  previousStatus: lastKnown,
                  currentStatus,
                  timestamp: new Date().toISOString(),
                  dashboardUrl: `http://${hostname}:${process.env.PORT || 8765}`,
                }),
              })

              db.prepare(`
                INSERT INTO notification_history (container_id, container_name, server_host, event_type, status)
                VALUES (?, ?, ?, 'container_stopped', ?)
              `).run(rule.container_id, rule.container_name, rule.server_host, currentStatus)

              db.prepare(`
                UPDATE notification_rules SET last_notified_at = unixepoch(), notification_count = notification_count + 1
                WHERE id = ?
              `).run(rule.id)
            } catch {
              db.prepare(`
                INSERT INTO notification_history (container_id, container_name, server_host, event_type, status, error_message)
                VALUES (?, ?, ?, 'container_stopped', ?, 'Failed to send email')
              `).run(rule.container_id, rule.container_name, rule.server_host, currentStatus)
            }
          }
        }

        db.prepare('UPDATE notification_rules SET last_known_status = ? WHERE id = ?')
          .run(currentStatus, rule.id)
      }
    } catch {
    }
  }, 30000)

  return NextResponse.json({ success: true, data: { running: true } })
}
