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
    '421570238335-gc4j4t3oaf90d2q2r4enaoes09d0ierj.apps.googleusercontent.com'

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


