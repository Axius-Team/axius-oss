# Setup Guide

## Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/Lucas-Henry/axius-oss.git
   cd axius-oss
   ```

2. Copy the environment file:
   ```
   cp .env.example .env.local
   ```

3. Generate encryption keys:
   ```
   openssl rand -base64 32
   openssl rand -base64 64
   ```
   Add these to `.env.local` as `ENCRYPTION_KEY` and `JWT_SECRET`.

4. Start with Docker:
   ```
   docker compose up -d
   ```

5. Open http://localhost:8765 and follow the setup wizard.

## Without Docker

1. Install dependencies:
   ```
   npm install
   ```

2. Copy environment file and generate keys as above.

3. Run the development server:
   ```
   npm run dev
   ```

4. Open http://localhost:8765.

## First Run

The first time you access Axius OSS, you will be guided through a setup wizard:

1. **Welcome** - Overview of what Axius OSS does
2. **Create Admin** - Set up your admin username and password
3. **SMTP (optional)** - Configure email notifications
4. **Done** - Complete setup and proceed to login
