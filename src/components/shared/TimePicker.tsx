import { useState, useRef, useCallback, TouchEvent, MouseEvent } from 'react'
import { padStart } from '@utils/string'
import { colors } from '@styles/colors'
import { currentDate } from '@utils/time'

// [00, 01, 02, ..., 23]
const hours = Array.from({ length: 24 }, (_, i) => padStart(i))
// [00, 05, 10, ..., 55]
const minutes5Term = Array.from({ length: 12 }, (_, i) => padStart(i * 5))

export default function TimePicker({
  value,
  onChange,
}: {
  value?: string
  onChange: (value: string /* hh:mm */) => void
}) {
  const [hour, setHour] = useState(value?.split(':')[0] ?? getNarrowTime().hour)
  const [minute, setMinute] = useState(value?.split(':')[1] ?? getNarrowTime().minute)

  return (
    <article className='relative flex items-center justify-center gap-24'>
      <Picker
        options={hours}
        initialValue={hour}
        onChange={(hour) => {
          setHour(hour)
          onChange(`${hour}:${minute}`)
        }}
      />
      <span className='text-black-darken font-bold'>:</span>
      <Picker
        options={minutes5Term}
        initialValue={minute}
        onChange={(minute) => {
          setMinute(minute)
          onChange(`${hour}:${minute}`)
        }}
      />

      <div className='absolute top-40 w-133 h-1 bg-gray-default'></div>
      <div className='absolute bottom-40 w-133 h-1 bg-gray-default'></div>
    </article>
  )
}

const getNarrowTime = () => {
  const now = currentDate()
  const hour = padStart(now.getHours())
  const minute = Math.floor(now.getMinutes() / 5 + 1) * 5

  return {
    hour,
    minute: minute === 60 ? '00' : padStart(minute),
  }
}

function Picker({
  options,
  initialValue,
  onChange,
}: {
  options: string[]
  initialValue: string
  onChange: (value: string) => void
}) {
  if (options.includes(initialValue) === false) {
    throw new Error('initialValue must be included in options')
  }

  const length = options.length
  const itemHeight = 40

  const [value, setValue] = useState(initialValue)
  const touchStartY = useRef<number | null>(null)
  const mouseStartY = useRef<number | null>(null)
  const currentPositionY = useRef<number>(0)

  /** 터치 및 마우스 이동 */
  const handleMove = useCallback(
    (clientY: number) => {
      const startY = touchStartY.current ?? mouseStartY.current
      if (startY != null) {
        const diff = startY - clientY // 이동 방향 (diff > 0: 아래로, diff < 0: 위로)
        currentPositionY.current += diff

        const updown = Math.round(currentPositionY.current / 64) // 정수값은 터치 민감도 조절에 사용
        if (updown !== 0) {
          const currentIndex = options.indexOf(value)
          let index = currentIndex + updown
          if (index < 0) {
            index = length - 1
          } else if (index > length - 1) {
            index = 0
          }
          setValue(options[index])
          onChange(options[index])
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
    [value], // eslint-disable-line react-hooks/exhaustive-deps
  )

  /** 터치 시작 */
  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  /** 마우스 다운 */
  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    mouseStartY.current = e.clientY
  }, [])

  /** 터치 이동 */
  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      handleMove(e.touches[0].clientY)
    },
    [handleMove],
  )

  /** 마우스 이동 */
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      handleMove(e.clientY)
    },
    [handleMove],
  )

  /** 터치 및 마우스 종료 */
  const handleEnd = useCallback(() => {
    touchStartY.current = null
    mouseStartY.current = null
    currentPositionY.current = 0
  }, [])

  const getDisplayOptions = (current: string, options: string[]) => {
    const currentIndex = options.indexOf(current)

    const displayOptions = []
    for (let i = -1; i <= 1; i++) {
      let index = currentIndex + i
      if (index < 0) {
        index = length + index
      } else if (index >= length) {
        index = index - length
      }
      displayOptions.push(options[index])
    }

    return displayOptions
  }

  return (
    <div
      className='relative flex flex-col overflow-hidden touch-none select-none cursor-move'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      style={{ height: itemHeight * 3 }}>
      {getDisplayOptions(value, options).map((option, index) => (
        <div
          key={index}
          className='flex items-center justify-center font-bold text-14'
          style={{
            height: itemHeight,
            color: Math.abs(index - 1) === 0 ? colors.black.darken : colors.gray.default,
          }}>
          {option}
        </div>
      ))}
    </div>
  )
}
