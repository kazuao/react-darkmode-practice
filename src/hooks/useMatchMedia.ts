import { useEffect, useState } from 'react'

export function useMatchMedia(
  query: string,
  initialValue: boolean = false,
): boolean {
  const [matches, setMatches] = useState(initialValue)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
