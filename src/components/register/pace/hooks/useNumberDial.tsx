import { useState, useRef, useCallback } from 'react'

// UseNumberDialProps 인터페이스 정의
interface UseNumberDialProps {
  initialValue: number
  min: number
  max: number
  onChange: (value: number) => void
}

// useNumberDial 훅 정의
export function useNumberDial({ initialValue, min, max, onChange }: UseNumberDialProps) {
  const [value, setValue] = useState(initialValue)
  const touchStartY = useRef<number | null>(null)
  const currentPositionY = useRef<number>(0)
  const lastValue = useRef<number>(value)

  // 터치 시작 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  // 터치 이동 핸들러
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current !== null) {
        const touchY = e.touches[0].clientY
        const diff = touchStartY.current - touchY
        currentPositionY.current += diff

        const newValue = Math.round(currentPositionY.current / 64) // 숫자 사이의 간격을 64px로 조정
        if (newValue !== 0) {
          let nextValue = value + newValue
          if (nextValue < min) {
            nextValue = max - (min - nextValue - 1)
          } else if (nextValue > max) {
            nextValue = min + (nextValue - max - 1)
          }
          setValue(nextValue)
          onChange(nextValue)
          lastValue.current = nextValue
          currentPositionY.current = 0 // 위치 초기화
        }

        touchStartY.current = touchY
      }
    },
    [min, max, onChange, value],
  )

  // 터치 종료 핸들러
  const handleTouchEnd = useCallback(() => {
    touchStartY.current = null
    currentPositionY.current = 0
  }, [])

  return {
    value,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
