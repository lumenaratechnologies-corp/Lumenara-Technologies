import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './styles/tailwind.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  console.error('Root element #root not found')
} else {
  const clientId =
    (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ||
    '973772894057-dqlr6ktlisv062nor30c1nqvekhjhrau.apps.googleusercontent.com'

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </GoogleOAuthProvider>
    </React.StrictMode>
  )
}


