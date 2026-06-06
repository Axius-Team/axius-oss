# Axius OSS

Self-hosted server monitoring for developers. Clone, run, done.

Axius OSS is a zero-configuration server management dashboard that runs entirely on your machine. No cloud dependencies, no third-party services, no data leaving your server. All data lives in a single SQLite file that you own and can backup.

## Features

- Real-time system monitoring (CPU, memory, storage, network, uptime)
- Docker container management (start, stop, restart, remove)
- File explorer with syntax highlighting
- Web terminal with multiple tabbed sessions
- Email notifications for container stop events (via SMTP)
- First-run setup wizard
- Customizable theming via CSS injection (tweakcn.com compatible)
- Dark/light mode toggle
- Local authentication with bcrypt + JWT
- Single SQLite database file
- Docker Compose deployment

## Prerequisites

- Docker and Docker Compose
- Git
- openssl (pre-installed on most systems)

## Quick Start

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

Open http://localhost:8765 and follow the setup wizard.

## Running Without Docker

**Linux:**
```bash
git clone https://github.com/Lucas-Henry/axius-oss.git
cd axius-oss
cp .env.example .env.local
sed -i "s|ENCRYPTION_KEY=|ENCRYPTION_KEY=$(openssl rand -hex 32)|" .env.local
sed -i "s|JWT_SECRET=|JWT_SECRET=$(openssl rand -hex 64)|" .env.local
npm install
npm run dev
```

Open http://localhost:8765 and follow the setup wizard.

## First Run Setup

The first time you access Axius OSS, you will be guided through a setup wizard:

1. Welcome - overview of features and data privacy
2. Create Admin - set up your admin username and password
3. SMTP (optional) - configure email notifications
4. Done - complete setup and login

## Deployment

See the deployment guides:

- [Nginx Reverse Proxy](docs/nginx.md)
- [Caddy Reverse Proxy](docs/caddy.md)

## Configuration Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP server port | `8765` |
| `NODE_ENV` | Environment | `development` |
| `ENCRYPTION_KEY` | AES-256 key for encrypting sensitive data | required |
| `JWT_SECRET` | Secret key for JWT token signing | required |
| `SHELL` | Shell binary for terminal sessions | `/bin/bash` |
| `DATA_DIR` | Directory for SQLite database | `./data` |

## Theming

Axius OSS supports custom themes via CSS variable injection:

1. Go to Settings > Appearance
2. Generate a theme at [tweakcn.com](https://tweakcn.com)
3. Paste the generated CSS into the theme editor
4. The theme applies immediately without page reload

## Security Notes

- The terminal spawns a local PTY as the same OS user as the Node.js process
- Docker socket access gives significant host access — use the optional socket proxy in production
- The Docker Compose setup mounts the host filesystem at `/mnt/host`, giving the file explorer full read/write access to the host. Do not expose Axius to untrusted networks without additional authentication (VPN, firewall, or reverse proxy with auth)
- This is a single-user system — the admin has full access to all features
- All passwords are hashed with bcrypt (cost factor 12)
- SMTP passwords are AES-256 encrypted at rest
- Sessions use HttpOnly, Secure, SameSite=Strict cookies

## Architecture

Axius OSS follows Atomic Design principles:

- **Atoms**: Stateless primitives (ThemeToggle, StatusDot, MetricBadge, CopyButton, LoadingSpinner)
- **Molecules**: Composed atoms with simple state (MetricCard, NavItem, ContainerRow, FileRow, NotificationToggle, SmtpStatusBanner)
- **Organisms**: Feature sections with business logic (Sidebar, MonitoringDashboard, DockerManagement, FileExplorer, TerminalTabManager, SettingsPanel, NotificationSettings, ThemeEditor)
- **Templates**: Page-level layout shells (DashboardShell, AuthShell, SetupShell)
- **Pages**: Next.js App Router pages that compose templates and organisms

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v3 + shadcn/ui
- SQLite (better-sqlite3)
- Docker (dockerode)
- systeminformation (metrics)
- xterm.js (terminal)
- node-pty (PTY)
- nodemailer (email)
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- zod (validation)
- recharts (charts)

## License

MIT
