'use client'

import { useState, useRef } from 'react'
import { EventAchievementType } from '@/types/achievement'
import { EventAchievementCard } from './EventAchievementCard'

/**
 * 이벤트 도전과제 슬라이더 컴포넌트 Props
 */
interface EventAchievementsSliderProps {
  achievements: EventAchievementType[]
}

/**
 * 이벤트 도전과제 슬라이더 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function EventAchievementsSlider({ achievements }: EventAchievementsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  /**
   * 드래그 시작 이벤트 핸들러
   * 
   * @param e - 마우스 이벤트
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return
    
    setIsDragging(true)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  /**
   * 드래그 중 이벤트 핸들러
   * 
   * @param e - 마우스 이벤트
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 2 // 스크롤 속도 조절
    sliderRef.current.scrollLeft = scrollLeft - walk
    e.preventDefault()
  }

  /**
   * 드래그 종료 이벤트 핸들러
   */
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="mb-4">
      <div 
        ref={sliderRef}
        className="overflow-x-auto whitespace-nowrap pb-4 cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="inline-flex gap-4">
          {achievements.map((achievement) => (
            <EventAchievementCard 
              key={achievement.id} 
              achievement={achievement} 
            />
          ))}
        </div>
      </div>
    </div>
  )
} 