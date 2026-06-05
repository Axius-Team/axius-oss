import Image from 'next/image'

interface AuthShellProps {
  children: React.ReactNode
  title: string
  description?: string
  theme: 'light' | 'dark'
}

export function AuthShell({ children, title, description, theme }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <Image
            src={theme === 'dark' ? '/images/axius-icon-white.png' : '/images/axius-icon-black.png'}
            alt="Axius"
            width={40}
            height={40}
            className="mx-auto"
          />
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
