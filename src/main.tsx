import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { TelegramProvider } from './providers/TelegramProvider'

// Zustand не требует Provider, можно использовать напрямую
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelegramProvider>
      <App />
    </TelegramProvider>
  </StrictMode>,
)
