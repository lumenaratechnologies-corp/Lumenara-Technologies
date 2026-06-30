import React from 'react'

type Props = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack)
  }

  retry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
          style={{ background: 'linear-gradient(135deg, #4a0a3a 0%, #2d0a3d 35%, #0a2d3d 70%, #0a1f2e 100%)' }}
        >
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-8 max-w-md">
            <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
            <p className="text-white/70 text-sm mb-6">
              The page ran into an error. You can try again or refresh the page.
            </p>
            <button
              type="button"
              onClick={this.retry}
              className="rounded-full font-semibold px-6 py-3 bg-black text-white border border-[#8A2BE2]/60 shadow-neon-purple hover:shadow-neon-purple-hover transition-all duration-300"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
