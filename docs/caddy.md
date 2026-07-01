# Caddy Reverse Proxy

Caddy automatically handles HTTPS with Let's Encrypt. No additional SSL configuration needed.

Replace `axius.example.com` with your actual domain.

```caddy
axius.example.com {
    handle /api/terminal* {
        reverse_proxy 127.0.0.1:8765 {
            header_up Host {host}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            flush_interval -1
        }
    }

    handle {
        reverse_proxy 127.0.0.1:8765 {
            header_up Host {host}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
}
```

The `/api/terminal*` block must come before the catch-all `handle` block.

## Note

> Do not expose Axius OSS to untrusted networks without additional access controls. The admin account has full access to your terminal, files, and Docker daemon. Consider restricting access by IP, adding a `basicauth` directive, or placing the instance behind a VPN.
