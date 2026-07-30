Axius OSS Security Policy

Reporting a Vulnerability

We take the security of Axius OSS seriously. If you discover a security vulnerability, please do not open a public issue. Instead, send a private report to the project maintainers.

Contact the project team directly through the GitHub security tab, by emailing support@axius.pro, or by reaching out to the repository owner. Reports are reviewed promptly, and we strive to acknowledge receipt within 48 hours.

We ask that you provide a detailed description of the vulnerability, including steps to reproduce if possible. This helps us address the issue quickly and effectively.

Supported Versions

Security updates are provided for the latest stable release. Older versions may receive critical patches on a case-by-case basis.

Security Practices

Axius OSS follows these security principles by design:

- All passwords are hashed with bcrypt at cost factor 12.
- Sensitive data at rest, such as SMTP credentials, is encrypted with AES-256-GCM.
- Session tokens are issued as HttpOnly, Secure, and SameSite Strict cookies.
- The SQLite database is stored in a user-defined directory with restricted file permissions.
- No telemetry, analytics, or external network requests are made without explicit user consent.
- Input validation is enforced with Zod schemas on all API routes.
- CSS input is sanitized through a dedicated sanitization function before storage.
- File system access validates paths to prevent directory traversal attacks.
- Rate limiting is applied to authentication endpoints.

Disclosure Policy

When a vulnerability is reported and confirmed, we will:

1. Acknowledge receipt of the report.
2. Investigate and develop a fix.
3. Release a patched version and publish a security advisory.
4. Credit the reporter in the advisory, if they wish to be acknowledged.

We ask that reporters allow reasonable time for a fix to be developed and deployed before disclosing the vulnerability publicly.

Self-Hosted Responsibility

Since Axius OSS is self-hosted, you are responsible for the security of your deployment. We recommend the following:

- Run Axius OSS behind a reverse proxy with TLS.
- Use a firewall to restrict access to the Axius OSS port.
- Consider a Docker socket proxy to limit container API exposure.
- Keep your deployment updated with the latest release.
- Do not expose Axius OSS directly to untrusted networks without additional authentication layers such as a VPN.
