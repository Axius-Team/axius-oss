interface ContainerStoppedParams {
  containerName: string
  containerId: string
  serverHost: string
  previousStatus: string
  currentStatus: string
  timestamp: string
  dashboardUrl: string
}

export function renderContainerStoppedEmail(params: ContainerStoppedParams): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:32px 24px;">
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#22c55e;">Container Stopped</h1>
              <p style="margin:0 0 24px 0;font-size:14px;color:#a1a1aa;">A container on <strong style="color:#e5e5e5;">${params.serverHost}</strong> has stopped.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px;background-color:#222;border-radius:8px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:4px 0;font-size:12px;color:#71717a;">Container</td></tr>
                      <tr><td style="padding:4px 0;font-size:14px;color:#e5e5e5;font-weight:500;">${params.containerName}</td></tr>
                      <tr><td style="padding:8px 0 4px 0;font-size:12px;color:#71717a;">Container ID</td></tr>
                      <tr><td style="padding:4px 0;font-size:12px;color:#a1a1aa;font-family:monospace;">${params.containerId.substring(0, 12)}</td></tr>
                      <tr><td style="padding:8px 0 4px 0;font-size:12px;color:#71717a;">Previous Status</td></tr>
                      <tr><td style="padding:4px 0;font-size:14px;color:#22c55e;">${params.previousStatus}</td></tr>
                      <tr><td style="padding:8px 0 4px 0;font-size:12px;color:#71717a;">Current Status</td></tr>
                      <tr><td style="padding:4px 0;font-size:14px;color:#ef4444;">${params.currentStatus}</td></tr>
                      <tr><td style="padding:8px 0 4px 0;font-size:12px;color:#71717a;">Time</td></tr>
                      <tr><td style="padding:4px 0;font-size:14px;color:#e5e5e5;">${params.timestamp}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${params.dashboardUrl}" style="display:inline-block;padding:12px 24px;background-color:#22c55e;color:#000;text-decoration:none;font-size:14px;font-weight:500;border-radius:8px;">Open Dashboard</a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0 0;font-size:11px;color:#52525b;text-align:center;">Axius OSS &mdash; Self-hosted server monitoring</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
