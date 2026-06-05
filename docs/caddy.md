# Caddy Reverse Proxy Configuration

```
axius.example.com {
    reverse_proxy 127.0.0.1:8765 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }

    handle /api/terminal* {
        reverse_proxy 127.0.0.1:8765 {
            header_up Host {host}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            flush_interval -1
        }
    }
}
```

Caddy automatically handles HTTPS with Let's Encrypt. No additional SSL configuration needed.
