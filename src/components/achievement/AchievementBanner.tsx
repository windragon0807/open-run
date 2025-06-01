'use client'

import { useState } from 'react'
import { AccordionButton } from './AccordionButton'
import { AchievementLabel, AchievementLabelType } from './AchievementLabel'
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
export function AchievementBanner({ id, title, labelType, status, details, className = '' }: AchievementBannerProps) {
  const [isOpen, setIsOpen] = useState(false)

  /**
   * 아코디언 토글 함수
   */
  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  /**
   * 배너 클릭 이벤트 핸들러
   */
  const handleBannerClick = () => {
    if (details) {
      toggleAccordion()
    }
  }

  return (
    <div
      className={`w-full rounded-10 bg-white shadow-floating-primary ${className} ${details ? 'cursor-pointer' : ''}`}
      onClick={handleBannerClick}>
      <div className='px-4 py-4'>
        {/* 배너 헤더 */}
        <div className='flex h-[60px] items-center justify-between px-[14px]'>
          <div className='flex items-center'>
            <AchievementLabel type={labelType} className='mr-[7px]' />
            <h3 className='text-[14px] font-bold leading-[20px] tracking-[-2%] text-[#222222]'>{title}</h3>
          </div>

          <div className='flex items-center' onClick={(e) => e.stopPropagation()}>
            <AchievementButton status={status} className='mr-[8px]' />

            {details && <AccordionButton isOpen={isOpen} onClick={toggleAccordion} className='my-auto' />}
          </div>
        </div>

        {/* 아코디언 내용 */}
        {details && isOpen && <div className='px-[14px] py-[12px]'>{details}</div>}
      </div>
    </div>
  )
}
