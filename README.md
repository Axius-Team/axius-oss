<table border="0">
  <tr>
    <td>
      <img width="80" height="80" alt="axius-ico" src="https://i.imgur.com/LkZ3BJk.png" />
    </td>
    <td>
      <h1>Axius OSS</h1>
    </td>
  </tr>
</table>

> Self-hosted server management dashboard for developers. No cloud. No telemetry. No surprises.

[![License](https://img.shields.io/badge/license-elv2-orange.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-stable-green.svg)]()
[![Stack](https://img.shields.io/badge/stack-Next.js%2015%20%2B%20TypeScript-blue.svg)]()

---

## What is Axius OSS?

**Axius OSS** is a zero-configuration server management dashboard that runs entirely on your machine. Clone the repository, generate two secrets, and you have a full monitoring and management interface running in under a minute.

There are no cloud dependencies, no third-party services, and no data leaving your server. Everything persists in a single SQLite file that you own and control.

---

## Core principles

**No external dependencies** — Axius OSS runs entirely on your infrastructure. There is no telemetry, no analytics endpoint, no license check, and no connection to any external service unless you explicitly configure SMTP notifications.

**You own your data** — all state lives in a single SQLite file at a path you control. Back it up, move it, inspect it directly. No hidden state.

**Zero configuration** — the setup wizard handles first-run configuration through a browser UI. There is nothing to configure before the first `docker compose up`.

**Single-user by design** — Axius OSS is built for the person who owns the server. One admin account with full access to all features, secured by bcrypt and JWT.

---

## Features

- Real-time system monitoring — CPU, memory, storage, network, uptime
- Docker container management — start, stop, restart, remove
- File explorer with syntax highlighting
- Web terminal with multiple tabbed sessions
- Email notifications for container stop events via SMTP
- First-run setup wizard
- Custom theming via CSS variable injection (tweakcn.com compatible)
- Dark and light mode
- Local authentication with bcrypt + JWT
- Single SQLite database file
- Docker Compose deployment

---

## Screenshots

**System monitoring** — real-time CPU, memory, storage, and network charts.

<img width="1872" height="1014" alt="image" src="https://github.com/user-attachments/assets/fb1214aa-85ae-4957-b47b-2878df9416ad" />

**File explorer** — browse the host filesystem with syntax-highlighted editing.

<img width="1868" height="1015" alt="image" src="https://github.com/user-attachments/assets/97392419-c3c5-463a-9d60-e28e55b8abd7" />

**Email notifications** — configure SMTP and receive alerts when a container stops.

<img width="1852" height="1021" alt="image" src="https://github.com/user-attachments/assets/b37a865a-36cc-4a8c-9ad5-17744314ce02" />

---

## Prerequisites

- Docker and Docker Compose
- Git
- `openssl` (pre-installed on most systems)

---

## Quick start

**Linux:**
```bash
git clone https://github.com/Lucas-Henry/axius-oss.git
cd axius-oss
cp .env.example .env.local
sed -i "s|ENCRYPTION_KEY=|ENCRYPTION_KEY=$(openssl rand -hex 32)|" .env.local
sed -i "s|JWT_SECRET=|JWT_SECRET=$(openssl rand -hex 64)|" .env.local
docker compose up -d
```

**macOS:**
```bash
git clone https://github.com/Lucas-Henry/axius-oss.git
cd axius-oss
cp .env.example .env.local
sed -i '' "s|ENCRYPTION_KEY=|ENCRYPTION_KEY=$(openssl rand -hex 32)|" .env.local
sed -i '' "s|JWT_SECRET=|JWT_SECRET=$(openssl rand -hex 64)|" .env.local
docker compose up -d
```

Open `http://localhost:8765` and follow the setup wizard.

### Running without Docker

```bash
git clone https://github.com/Lucas-Henry/axius-oss.git
cd axius-oss
cp .env.example .env.local
sed -i "s|ENCRYPTION_KEY=|ENCRYPTION_KEY=$(openssl rand -hex 32)|" .env.local
sed -i "s|JWT_SECRET=|JWT_SECRET=$(openssl rand -hex 64)|" .env.local
npm install
npm run dev
```

---

## First-run setup

The first time you open `http://localhost:8765`, you are guided through a four-step wizard:

1. **Welcome** — overview of features and data privacy
2. **Create admin** — set your username and password
3. **SMTP** (optional) — configure email notifications for container events
4. **Done** — complete setup and log in

---

## Configuration

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP server port | `8765` |
| `NODE_ENV` | Environment | `development` |
| `ENCRYPTION_KEY` | AES-256 key for encrypting sensitive data at rest | required |
| `JWT_SECRET` | Secret for signing JWT session tokens | required |
| `SHELL` | Shell binary for terminal sessions | `/bin/bash` |
| `DATA_DIR` | Directory where the SQLite database is stored | `./data` |

---

## Deployment

For production deployments behind a reverse proxy:

- [Nginx reverse proxy](docs/nginx.md)
- [Caddy reverse proxy](docs/caddy.md)

---

## Theming

Axius OSS supports full theme customization via CSS variable injection:

1. Go to **Settings > Appearance**
2. Generate a theme at [tweakcn.com](https://tweakcn.com)
3. Paste the generated CSS into the theme editor

The theme applies immediately without a page reload.

---

## Security

**What Axius OSS does:**
- Hashes all passwords with bcrypt (cost factor 12)
- Encrypts SMTP passwords with AES-256 at rest
- Issues session tokens as HttpOnly, Secure, SameSite=Strict cookies
- Accepts an optional Docker socket proxy to limit container API surface

**What you need to be aware of:**
- The web terminal spawns a PTY as the same OS user running the Node.js process. If Node runs as root, the terminal runs as root.
- Docker socket access gives significant host access. Use the optional socket proxy in production environments.
- The Docker Compose setup mounts the host filesystem at `/mnt/host`, giving the file explorer full read/write access. Do not expose Axius OSS to untrusted networks without additional controls — a VPN, firewall rule, or reverse proxy with authentication in front of it.
- This is a single-user system. The admin account has full access to everything.

---

## Architecture

Axius OSS follows Atomic Design principles.

**Atoms** — stateless primitives: `ThemeToggle`, `StatusDot`, `MetricBadge`, `CopyButton`, `LoadingSpinner`

**Molecules** — composed atoms with simple local state: `MetricCard`, `NavItem`, `ContainerRow`, `FileRow`, `NotificationToggle`, `SmtpStatusBanner`

**Organisms** — feature sections with business logic: `Sidebar`, `MonitoringDashboard`, `DockerManagement`, `FileExplorer`, `TerminalTabManager`, `SettingsPanel`, `NotificationSettings`, `ThemeEditor`

**Templates** — page-level layout shells: `DashboardShell`, `AuthShell`, `SetupShell`

**Pages** — Next.js App Router pages that compose templates and organisms

---

## Tech stack

- Next.js 15 (App Router) + React 19
- TypeScript (strict mode)
- Tailwind CSS v3 + shadcn/ui
- SQLite via better-sqlite3
- Docker via dockerode
- systeminformation for host metrics
- xterm.js + node-pty for the terminal
- nodemailer for SMTP notifications
- bcryptjs + jsonwebtoken for authentication
- zod for validation
- recharts for charts

---

## What Axius OSS does NOT do

This is explicit and intentional:

- Does not send any data to external servers
- Does not collect usage metrics or telemetry
- Does not support multi-user access or role-based permissions
- Does not manage multiple servers from a single instance
- Does not replace a proper secrets manager for production secrets

---

## License

Elastic License 2.0 . see [LICENSE](LICENSE) for details.

---

<table border="0" width="100%">
  <tr>
    <td align="center" style="padding: 32px 0 16px 0;">
      <img width="40" height="40" alt="axius-ico" src="https://github.com/user-attachments/assets/f1917052-9911-42d2-934c-70235a062767" />
      <h3>Need more?</h3>
      <p>Axius OSS is free and always will be. For multi-server management and more, see <strong><a href="https://axius.pro">Axius Pro</a></strong>.</p>
    </td>
  </tr>
</table>
