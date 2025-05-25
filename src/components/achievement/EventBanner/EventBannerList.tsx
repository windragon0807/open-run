'use client'

import { EventAchievementType } from '@/types/achievement'
import type { AchievementStatus } from '@/types/achievement'
import { useState } from 'react'
import { AchievementButton, AchievementButtonType } from '../buttons'
import { ProgressBar } from '../buttons'

/**
 * 이벤트 배너 리스트 Props
 */
export interface EventBannerListProps {
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
  /** 클릭 이벤트 핸들러 */
  onEventClick?: (event: EventAchievementType) => void
}

/**
 * 개별 이벤트 배너 아이템 Props
 */
interface EventBannerListItemProps {
  /** 이벤트 도전과제 */
  event: EventAchievementType
  /** 펼쳐짐 상태 */
  isExpanded: boolean
  /** 펼치기/접기 핸들러 */
  onToggle: () => void
  /** 클릭 이벤트 핸들러 */
  onEventClick?: (event: EventAchievementType) => void
}

/**
 * 서브 도전과제 아이템 Props
 */
interface SubChallengeItemProps {
  /** 서브 도전과제 */
  challenge: {
    id: string
    theme: string
    title: string
    description: string
    progress: { current: number; total: number }
    status: AchievementStatus
    imageUrl?: string
  }
  /** 클릭 이벤트 핸들러 */
  onChallengeClick?: (challenge: any) => void
}

/**
 * 서브 도전과제 아이템 컴포넌트
 */
function SubChallengeItem({ challenge, onChallengeClick }: SubChallengeItemProps) {
  const isCompleted = challenge.status === '완료'
  const isPending = challenge.status === '진행중'

  /**
   * 버튼 타입 결정 함수
   */
  const getButtonType = (): AchievementButtonType => {
    if (isCompleted) return 'completed'
    if (isPending) return 'progress'
    return 'reward'
  }

  /**
   * 진행도 텍스트 생성
   */
  const getProgressText = () => {
    if (isCompleted) return '완료'
    return `${challenge.progress.current}/${challenge.progress.total}`
  }

  return (
    <div className='mb-3 flex w-full justify-center'>
      <div className='relative flex h-[120px] w-[328px] cursor-pointer rounded-[10px] bg-white shadow-sm transition-all duration-300'>
        {/* 서브 도전과제 이미지 */}
        <div
          className='my-[30px] ml-[16px] h-[60px] w-[60px] rounded-[10px] bg-[#DEE2E6] transition-transform duration-300'
          style={{
            backgroundSize: 'cover',
            backgroundImage: challenge.imageUrl ? `url(${challenge.imageUrl})` : 'none',
            backgroundPosition: 'center',
          }}></div>

        {/* 서브 도전과제 콘텐츠 영역 */}
        <div className='relative ml-[8px] flex-1'>
          {/* 제목과 설명 */}
          <div className='mt-[22px]'>
            {/* 이벤트 주제 */}
            <h4
              className='max-w-[180px] truncate text-[14px] font-bold leading-[20px] tracking-[-0.02em] text-[#666666]'
              style={{ fontFamily: 'Pretendard', fontWeight: 700 }}>
              {challenge.theme}
            </h4>

            {/* 이벤트 제목 */}
            <h5
              className='max-w-[180px] truncate text-[14px] font-bold leading-[20px] tracking-[-0.02em] text-[#222222]'
              style={{ fontFamily: 'Pretendard', fontWeight: 700 }}>
              {challenge.title}
            </h5>

            <p className='max-w-[180px] truncate text-[12px] font-normal leading-[16px] tracking-[-0.02em] text-[#666666]'>
              {challenge.description}
            </p>
          </div>

          {/* 하단 정보 영역 */}
          <div className='absolute bottom-[16px] left-0 right-[16px] flex items-center justify-between'>
            <div className='mr-[11px] flex-1'>
              {/* 진행도 바 */}
              <ProgressBar current={challenge.progress.current} total={challenge.progress.total} width='100%' />
            </div>

            {/* 진행도 텍스트 또는 버튼 */}
            <div className='flex items-center'>
              {isCompleted ? (
                <AchievementButton
                  type={getButtonType()}
                  status={challenge.status}
                  current={challenge.progress.current}
                  total={challenge.progress.total}
                  onClick={() => onChallengeClick?.(challenge)}
                />
              ) : (
                <div className='rounded-[6px] bg-[#F8F9FA] px-[12px] py-[6px] text-[12px] font-medium text-[#666666]'>
                  {getProgressText()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 개별 이벤트 배너 아이템 컴포넌트
 */
function EventBannerListItem({ event, isExpanded, onToggle, onEventClick }: EventBannerListItemProps) {
  const isCompleted = event.status === '완료'

  /**
   * 이벤트 레이블 결정 함수
   */
  const getEventLabel = () => {
    if (isCompleted) return '종료예정'
    return '이벤트'
  }

  /**
   * 레이블 색상 결정 함수
   */
  const getLabelColor = () => {
    if (isCompleted) return 'bg-[#F06595] text-white'
    return 'bg-[#DEE2E6] text-[#222222]'
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

  // 이벤트별 서브 도전과제 데이터 생성
  const getSubChallenges = () => {
    if (event.theme === '[2024 크리스마스]') {
      return [
        {
          id: '1',
          theme: event.theme,
          title: '루돌프 선물배달 작전',
          description: '이벤트 NFT 장착하고 성당 근처에서 달리기',
          progress: { current: 1, total: 1 },
          status: '완료' as AchievementStatus,
          imageUrl: event.imageUrl,
        },
        {
          id: '2',
          theme: event.theme,
          title: '이벤트 NFT 컬렉터',
          description: '모든 NFT를 모아보자!',
          progress: { current: 1, total: 1 },
          status: '완료' as AchievementStatus,
        },
        {
          id: '3',
          theme: event.theme,
          title: '오늘부터 내가 루돌프',
          description: '이벤트 첫 출석보상',
          progress: { current: 1, total: 1 },
          status: '완료' as AchievementStatus,
        },
      ]
    } else if (event.theme === '[2025 신년]') {
      return [
        {
          id: '1',
          theme: event.theme,
          title: '새해 첫 달리기',
          description: '2025년 첫 러닝을 완주하세요',
          progress: { current: 1, total: 1 },
          status: '완료' as AchievementStatus,
          imageUrl: event.imageUrl,
        },
        {
          id: '2',
          theme: event.theme,
          title: '신년 다짐 세우기',
          description: '올해의 목표를 설정해보세요',
          progress: { current: 0, total: 1 },
          status: '진행중' as AchievementStatus,
        },
        {
          id: '3',
          theme: event.theme,
          title: '새해 인사하기',
          description: '친구들에게 새해 인사를 전하세요',
          progress: { current: 0, total: 1 },
          status: '진행중' as AchievementStatus,
        },
      ]
    } else {
      // 기본 서브 도전과제
      return [
        {
          id: '1',
          theme: event.theme,
          title: event.title,
          description: event.description,
          progress: { current: event.progress?.current || 0, total: event.progress?.total || 1 },
          status: event.status,
          imageUrl: event.imageUrl,
        },
      ]
    }
  }

  const subChallenges = getSubChallenges()

  return (
    <div className='mb-[14px] flex w-full flex-col items-center'>
      {/* 메인 배너 */}
      <div
        className={`relative flex h-[120px] w-[328px] cursor-pointer rounded-[10px] bg-white shadow-floating-primary transition-all duration-300 ${
          isCompleted ? 'opacity-60' : ''
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
            {/* 모두 받기 버튼 */}
            <button
              className='flex h-[40px] w-[60px] items-center justify-center rounded-[8px] bg-[#5B7EFF] text-[12px] font-bold text-white transition-colors duration-200 hover:bg-[#4A6EEF]'
              onClick={(e) => {
                e.stopPropagation()
                onEventClick?.(event)
              }}>
              모두 받기
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
        <div className='mt-[12px] w-[328px] transition-all duration-300'>
          {subChallenges.map((challenge) => (
            <SubChallengeItem key={challenge.id} challenge={challenge} onChallengeClick={onEventClick} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 이벤트 배너 리스트 컴포넌트 (이벤트 탭용)
 *
 * @param props - 컴포넌트 Props
 */
export function EventBannerList({ eventAchievements, onEventClick }: EventBannerListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  /**
   * 아이템 펼치기/접기 토글
   */
  const toggleItem = (eventId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  if (eventAchievements.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-[60px]'>
        <div className='mb-[8px] text-[14px] font-medium text-[#999999]'>진행 중인 이벤트가 없습니다</div>
        <div className='text-[12px] font-normal text-[#CCCCCC]'>새로운 이벤트를 기다려주세요!</div>
      </div>
    )
  }

  return (
    <div className='w-full px-[16px] py-[20px]'>
      {eventAchievements.map((event) => (
        <EventBannerListItem
          key={event.id}
          event={event}
          isExpanded={expandedItems.has(event.id)}
          onToggle={() => toggleItem(event.id)}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  )
}
