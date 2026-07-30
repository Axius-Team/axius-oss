Axius OSS Disclaimer

Copyright (c) 2026 Axius Team

This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.

Axius OSS is a self-hosted server management tool. By using it, you acknowledge that:

- You are responsible for securing the server and network on which Axius OSS runs.
- The web terminal spawns a shell process with the same privileges as the running Node.js process. If the process runs as root, the terminal has root access.
- Docker socket access provides significant host-level control. Using a Docker socket proxy is recommended for production deployments.
- The file explorer mounts the host filesystem with read and write access. Do not expose Axius OSS to untrusted networks without additional protections such as a VPN, firewall, or reverse proxy.
- This is a single-user system. The admin account has unrestricted access to all features and data.

You assume all responsibility for any consequences arising from the use of this software, including but not limited to data loss, security breaches, or service interruptions.
