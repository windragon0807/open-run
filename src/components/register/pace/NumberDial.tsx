import React from 'react'

interface NumberDialProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: () => void
}

export default function NumberDial({
  value,
  min,
  max,
  onChange,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}: NumberDialProps) {
  const getDisplayNumbers = (current: number, min: number, max: number) => {
    const numbers = []
    for (let i = -2; i <= 2; i++) {
      let num = current + i
      if (num < min) {
        num = max - (min - num - 1)
      } else if (num > max) {
        num = min + (num - max - 1)
      }
      numbers.push(num)
    }
    return numbers
  }

  const displayNumbers = getDisplayNumbers(value, min, max)

  return (
    <div
      className='relative w-80 h-full overflow-hidden touch-none'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      {displayNumbers.map((num, index) => {
        // 현재 선택된 값과의 거리 계산
        const distance = Math.abs(index - 2)
        return (
          <div
            key={index}
            className={`absolute w-80 flex items-center justify-center transition-all duration-200 text-4xl italic font-black leading-[56px] tracking-tight ${
              distance === 0
                ? 'text-[#4A5CEF]'
                : distance === 1
                  ? 'text-[rgba(74,92,239,0.18)]'
                  : 'text-[rgba(74,92,239,0.04)]'
            }`}
            style={{ transform: `translateY(${(index - 2) * 64 + 128}px)`, fontSize: '56px' }} // 중앙 정렬을 위해 +128px 추가
          >
            {num.toString().padStart(2, '0')}
          </div>
        )
      })}
    </div>
  )
}
