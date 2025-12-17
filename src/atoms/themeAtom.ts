import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { useMatchMedia } from '../hooks/useMatchMedia'

export type ColorMode = 'light' | 'dark' | 'system'

// グローバルな状態として定義
// 初期値は undefined (クライアントサイドでの初期化待ち)
const colorModeAtom = atom<ColorMode | undefined>(undefined)

export function useJotaiColorMode() {
  const [colorMode, setColorMode] = useAtom(colorModeAtom)
  // 既存のフックを再利用
  const preferColorSchemeIsDark = useMatchMedia(
    '(prefers-color-scheme: dark)',
    true,
  )

  // 初期化: localStorage から読み込み
  // Context版と同じく、マウント時に一度だけ実行
  useEffect(() => {
    const storageValue = window.localStorage.getItem('theme-storage')
    if (storageValue === 'light' || storageValue === 'dark') {
      setColorMode(storageValue)
    } else {
      setColorMode('system')
    }
  }, [setColorMode])

  // 実際のモードを計算
  const actualColorMode =
    colorMode === 'system'
      ? preferColorSchemeIsDark
        ? 'dark'
        : 'light'
      : colorMode

  // DOMへの反映
  useEffect(() => {
    if (actualColorMode) {
      document.documentElement.dataset.colorMode = actualColorMode
    }
  }, [actualColorMode])

  // 設定変更時のラッパー（localStorageへの保存）
  const setMode = (mode: ColorMode) => {
    setColorMode(mode)
    window.localStorage.setItem('theme-storage', mode)
  }

  return {
    colorMode,
    setColorMode: setMode,
    actualColorMode,
  }
}
