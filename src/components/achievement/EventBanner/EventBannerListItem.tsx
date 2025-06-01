'use client'

import { SubChallengeItem } from './SubChallengeItem'
import { ENDING_SOON_DAYS_BEFORE } from './constants'
import { EventBannerListItemProps } from './types'
import { getSubChallenges } from './utils'

/**
 * 개별 이벤트 배너 아이템 컴포넌트
 */
export function EventBannerListItem({ event, isExpanded, onToggle, onEventClick }: EventBannerListItemProps) {
  const isCompleted = event.status === '완료'

  /**
   * 종료 예정 상태 확인 함수
   */
  const isEndingSoon = () => {
    if (!event.endDate) return false

    const endDate = new Date(event.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays <= ENDING_SOON_DAYS_BEFORE && diffDays > 0
  }

  /**
   * 이벤트 레이블 결정 함수
   */
  const getEventLabel = () => {
    if (isEndingSoon()) return '종료예정'
    return '이벤트'
  }

  /**
   * 레이블 색상 결정 함수
   */
  const getLabelColor = () => {
    if (isEndingSoon()) return 'bg-[#F06595] text-white'
    return 'bg-[#DEE2E6] text-[#222222]'
  }

  /**
   * 버튼 텍스트 결정 함수
   */
  const getButtonText = () => {
    if (isCompleted) return '종료된\n이벤트'
    return '모두 받기'
  }

  /**
   * 버튼 스타일 결정 함수
   */
  const getButtonStyle = () => {
    if (isCompleted) {
      return 'bg-[#DEE2E6] text-[#89939D] hover:bg-[#CED4DA]'
    }
    return 'bg-[#5B7EFF] text-white hover:bg-[#4A6EEF]'
  }

  /**
   * 배너 클릭 핸들러 (아코디언 토글)
   */
  const handleBannerClick = (e: React.MouseEvent) => {
    // 버튼 클릭 시에는 아코디언 토글하지 않음
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onToggle()
  }

  const subChallenges = getSubChallenges(event)

  return (
    <div className='mb-[14px] flex w-full flex-col items-center'>
      {/* 메인 배너 */}
      <div
        className={`relative flex h-[120px] w-full cursor-pointer rounded-[10px] bg-white shadow-floating-primary transition-all duration-300 ${
          isCompleted ? 'opacity-40' : ''
        }`}
        onClick={handleBannerClick}
        role='button'
        tabIndex={0}
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}>
        {/* 이벤트 레이블 */}
        <div className='absolute left-[13px] top-[48px]'>
          <div
            className={`${getLabelColor()} flex h-[24px] w-[53px] items-center justify-center rounded-[25px] text-center text-[12px] font-normal leading-[16px] tracking-[-0.02em]`}
            style={{ fontFamily: 'Pretendard', fontWeight: 400 }}>
            {getEventLabel()}
          </div>
        </div>

        {/* 이벤트 콘텐츠 영역 */}
        <div className='relative ml-[80px] flex-1'>
          {/* 이벤트 제목과 설명 */}
          <div className='mb-[31px] mt-[33px]'>
            {/* 이벤트 주제 */}
            <h3
              className='max-w-[200px] truncate text-[14px] font-bold leading-[20px] tracking-[-0.02em] text-[#666666] transition-opacity duration-300'
              style={{ fontFamily: 'Pretendard', fontWeight: 700 }}>
              {event.theme}
            </h3>

            {/* 이벤트 제목 */}
            <h4
              className='max-w-[200px] truncate text-[14px] font-bold leading-[20px] tracking-[-0.02em] text-[#222222] transition-opacity duration-300'
              style={{ fontFamily: 'Pretendard', fontWeight: 700 }}>
              {event.title}
            </h4>

            {/* 이벤트 기간 */}
            <p className='text-[12px] font-normal leading-[16px] tracking-[-0.02em] text-[#222222] transition-opacity duration-300'>
              ~ {event.endDate}
            </p>
          </div>

          {/* 모두 받기 버튼과 아코디언 버튼 */}
          <div className='absolute right-[16px] top-[40px] flex items-center'>
            {/* 모두 받기 / 종료된 이벤트 버튼 */}
            <button
              className={`flex h-[40px] w-[60px] items-center justify-center whitespace-pre-line rounded-[8px] text-[12px] font-bold transition-colors duration-200 ${getButtonStyle()}`}
              onClick={(e) => {
                e.stopPropagation()
                if (!isCompleted) {
                  onEventClick?.(event)
                }
              }}
              disabled={isCompleted}>
              {getButtonText()}
            </button>

            {/* 펼치기/접기 버튼 */}
            <button
              className={`bg-black/10 ml-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              aria-label={isExpanded ? '접기' : '펼치기'}>
              <svg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M1 1.5L6 6.5L11 1.5'
                  stroke='#222222'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 펼쳐진 서브 도전과제들 */}
      {isExpanded && (
        <div className='mt-[12px] w-full transition-all duration-300'>
          {subChallenges.map((challenge) => (
            <SubChallengeItem key={challenge.id} challenge={challenge} onChallengeClick={onEventClick} />
          ))}
        </div>
      )}
    </div>
  )
}
