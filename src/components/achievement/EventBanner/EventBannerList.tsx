'use client'

import { useState } from 'react'
import { EventBannerListItem } from './EventBannerListItem'
import { EventBannerListProps } from './types'

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
