import { useEffect, useState } from 'react'

const STORAGE_KEY = 'astr_theme'

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label="Toggle light and dark theme"
      title={isLight ? 'Switch to dark' : 'Switch to light'}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-500/30 text-gold-400 transition hover:border-gold-400 ${className}`}
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M20.5 14.5a8.5 8.5 0 1 1-9-13 7 7 0 0 0 9 13z" />
        </svg>
      )}
    </button>
  )
}
