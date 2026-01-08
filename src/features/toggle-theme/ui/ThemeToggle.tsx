'use client'

import { Button } from '@/shared/ui/button'
import { useThemeStore } from '../model/themeStore'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <Button onClick={toggleTheme} variant="outline">
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  )
}
