export type ThemeMode = 'dark' | 'light'

/**
 * Switches between dark and light themes without CSS transition flicker across
 * mixed-color surfaces by temporarily suppressing transitions across a forced reflow.
 */
export function switchThemeWithoutGlitch(nextTheme: ThemeMode): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.classList.add('disable-transitions')

  if (nextTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.style.colorScheme = nextTheme

  // Force synchronous reflow so computed theme styles settle before transitions resume
  void root.offsetHeight

  requestAnimationFrame(() => {
    root.classList.remove('disable-transitions')
  })
}
