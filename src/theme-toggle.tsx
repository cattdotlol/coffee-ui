import { useState } from 'react'
import { Switch } from '@catpkgs/coffee-ui'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.dataset.theme === 'dark',
  )

  function toggleTheme() {
    const theme = isDark ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'dark' ? '#1a1411' : '#f3ece4',
    )
    setIsDark(!isDark)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      return
    }
  }

  return (
    <Switch label="Dark mode" checked={isDark} onChange={toggleTheme} />
  )
}
