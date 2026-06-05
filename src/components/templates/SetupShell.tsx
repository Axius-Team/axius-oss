'use client'

import { useState } from 'react'

interface SetupStep {
  id: string
  title: string
  component: React.ReactNode
}

interface SetupShellProps {
  steps: SetupStep[]
  onComplete: () => void
}

export function SetupShell({ steps, onComplete }: SetupShellProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const isLast = currentStep === steps.length - 1

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Axius OSS</h1>
          <p className="text-muted-foreground">Self-hosted server monitoring</p>
        </div>

        <div className="flex justify-center gap-2">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`h-2 w-16 rounded-full transition-colors ${
                i <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">{steps[currentStep].title}</h2>
          {steps[currentStep].component}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Back
          </button>
          {isLast ? (
            <button
              onClick={onComplete}
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Finish Setup
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
