/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: [
    'better-sqlite3',
    'systeminformation',
    'dockerode',
    'node-pty',
    'ssh2',
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3',
        'systeminformation': 'commonjs systeminformation',
        'dockerode': 'commonjs dockerode',
        'node-pty': 'commonjs node-pty',
      })
    }
    return config
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' ws:; frame-ancestors 'none'" },
      ],
    },
  ],
}

export default nextConfig
