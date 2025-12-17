import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react'
import { useMatchMedia } from '../hooks/useMatchMedia'

export type ColorMode = 'light' | 'dark' | 'system'

type ColorModeContextValue = {
  colorMode: ColorMode | undefined
  setColorMode: (color: ColorMode) => void
  actualColorMode: 'light' | 'dark' | undefined
}

const ColorModeContext = createContext<ColorModeContextValue>({
  colorMode: 'system',
  setColorMode: () => null,
  actualColorMode: 'light',
})

export const ColorModeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [colorMode, _setColorMode] = useState<ColorMode>()
  const preferColorSchemeIsDark = useMatchMedia(
    '(prefers-color-scheme: dark)',
    true,
  )

  useEffect(() => {
    const storageValue = window.localStorage.getItem('theme-storage')
    if (storageValue === 'light' || storageValue === 'dark') {
      _setColorMode(storageValue)
    } else {
      _setColorMode('system')
    }
  }, [])

  const setColorMode = useCallback((color: ColorMode) => {
    _setColorMode(color)
    window.localStorage.setItem('theme-storage', color)
  }, [])

  const actualColorMode =
    colorMode === 'system'
      ? preferColorSchemeIsDark
        ? 'dark'
        : 'light'
      : colorMode

  const value: ColorModeContextValue = useMemo(
    () => ({
      colorMode,
      setColorMode,
      actualColorMode,
    }),
    [actualColorMode, colorMode, setColorMode],
  )

  useEffect(() => {
    if (actualColorMode) {
      document.documentElement.dataset.colorMode = actualColorMode
    }
  }, [actualColorMode])

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  )
}

export function useColorMode() {
  return useContext(ColorModeContext)
}
