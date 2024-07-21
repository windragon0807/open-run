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
  const mouseStartY = useRef<number | null>(null)
  const currentPositionY = useRef<number>(0)
  const lastValue = useRef<number>(value)

  // 터치 시작 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  // 마우스 다운 핸들러
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStartY.current = e.clientY
  }, [])

  // 터치 및 마우스 이동 핸들러
  const handleMove = useCallback(
    (clientY: number) => {
      const startY = touchStartY.current ?? mouseStartY.current
      if (startY !== null) {
        const diff = startY - clientY // 이동 방향 수정
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

        if (touchStartY.current !== null) {
          touchStartY.current = clientY
        }
        if (mouseStartY.current !== null) {
          mouseStartY.current = clientY
        }
      }
    },
    [min, max, onChange, value],
  )

  // 터치 이동 핸들러
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientY)
    },
    [handleMove],
  )

  // 마우스 이동 핸들러
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientY)
    },
    [handleMove],
  )

  // 터치 및 마우스 종료 핸들러
  const handleEnd = useCallback(() => {
    touchStartY.current = null
    mouseStartY.current = null
    currentPositionY.current = 0
  }, [])

  // 휠 핸들러
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const newValue = value + (e.deltaY > 0 ? 1 : -1)
      let nextValue = newValue
      if (nextValue < min) {
        nextValue = max
      } else if (nextValue > max) {
        nextValue = min
      }
      setValue(nextValue)
      onChange(nextValue)
    },
    [min, max, onChange, value],
  )

  return {
    value,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd: handleEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp: handleEnd,
    handleWheel,
  }
}
