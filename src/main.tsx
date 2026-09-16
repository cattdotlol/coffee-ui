import { StrictMode } from 'react'
import { MotionConfig } from 'motion/react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import '@fontsource-variable/dm-sans/wght.css'
import './index.css'
import router from './app-router.tsx'
import { ToastProvider } from '@catpkgs/coffee-ui'
import { applyTheme, loadTheme } from './theme-studio/theme.ts'

const savedTheme = loadTheme()
if (savedTheme) applyTheme(savedTheme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user" transition={{ duration: 0.15, ease: 'easeOut' }}>
      <ToastProvider><RouterProvider router={router} /></ToastProvider>
    </MotionConfig>
  </StrictMode>,
)
