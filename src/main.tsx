import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'
import { ClassroomModeProvider } from './contexts/ClassroomModeContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserProfileProvider } from './contexts/UserProfileContext'
import { AudioProvider } from './contexts/AudioProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <UserProfileProvider>
        <ClassroomModeProvider>
          <AudioProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </AudioProvider>
        </ClassroomModeProvider>
      </UserProfileProvider>
    </ThemeProvider>
  </StrictMode>,
)
