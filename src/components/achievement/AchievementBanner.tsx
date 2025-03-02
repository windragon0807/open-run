'use client'

import { useState } from 'react'
import { AchievementLabel, AchievementLabelType } from './AchievementLabel'
import { AccordionButton } from './AccordionButton'
import { AchievementButton } from './buttons/AchievementButton'

/**
 * 도전과제 배너 컴포넌트 Props
 */
interface AchievementBannerProps {
  /** 도전과제 ID */
  id: string
  /** 도전과제 제목 */
  title: string
  /** 도전과제 설명 */
  description: string
  /** 도전과제 라벨 타입 */
  labelType: AchievementLabelType
  /** 도전과제 상태 */
  status: '대기중' | '진행중' | '완료'
  /** 도전과제 상세 내용 */
  details?: React.ReactNode
  /** 추가 클래스명 */
  className?: string
}

/**
 * 도전과제 배너 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 * @returns 도전과제 배너 컴포넌트
 */
export function AchievementBanner({ 
  id, 
  title, 
  labelType, 
  status, 
  details,
  className = '' 
}: AchievementBannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }
  
  return (
    <div className={`w-[328px] rounded-[10px] bg-white shadow ${className}`}>
      <div className="px-4 py-4">
        {/* 배너 헤더 */}
        <div className="flex items-center justify-between h-[60px] px-[14px]">
          <div className="flex items-center">
            <AchievementLabel type={labelType} className="mr-[7px]" />
            <h3 className="font-bold text-[14px] leading-[20px] tracking-[-2%] text-[#222222]">
              {title}
            </h3>
          </div>
          
          <div className="flex items-center">
            <AchievementButton
              status={status}
              onClick={() => console.log(`Achievement ${id} button clicked`)}
              className="mr-[8px]"
            />
            
            {details && (
              <AccordionButton 
                isOpen={isOpen} 
                onClick={toggleAccordion} 
                className="my-auto" 
              />
            )}
          </div>
        </div>
        
        {/* 아코디언 내용 */}
        {details && isOpen && (
          <div className="px-[14px] py-[12px]">
            {details}
          </div>
        )}
      </div>
    </div>
  )
} 