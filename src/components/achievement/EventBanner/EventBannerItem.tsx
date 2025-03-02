'use client'

import { EventAchievementType } from '@/types/achievement'
import { AchievementButton, AchievementButtonType, ProgressBar } from '../buttons'

/**
 * 이벤트 배너 아이템 Props
 */
export interface EventBannerItemProps {
  /** 이벤트 도전과제 */
  event: EventAchievementType
}

/**
 * 이벤트 배너 아이템 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function EventBannerItem({ event }: EventBannerItemProps) {
  const isCompleted = event.status === '완료';
  const isPending = event.status === '진행중';
  
  /**
   * 버튼 타입 결정 함수
   */
  const getButtonType = (): AchievementButtonType => {
    if (isCompleted) return 'completed';
    if (isPending) return 'progress';
    return 'reward';
  };

  return (
    <div 
      className={`bg-[#ADB5BD] rounded-[10px] w-full h-[134px] flex relative ${isCompleted ? 'opacity-60' : ''}`}
    >
      {/* 이벤트 이미지 */}
      <div 
        className="w-[60px] h-[60px] rounded-[10px] bg-[#DEE2E6] my-[30px] ml-[16px]"
        style={{ 
          backgroundSize: 'cover',
          backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : 'none',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* 이벤트 콘텐츠 */}
      <div className="flex flex-col ml-[8px] mt-[22px]">
        {/* 이벤트 제목 */}
        <h3 className="text-[#222222] font-bold text-[14px] leading-[20px] tracking-[-0.02em] truncate max-w-[160px]">
          {event.title}
        </h3>
        
        {/* 이벤트 설명 */}
        <p className="text-[#222222] font-normal text-[12px] leading-[16px] tracking-[-0.02em] truncate max-w-[160px]">
          {event.description}
        </p>
      </div>
      
      {/* 진행도 표시 선 */}
      <ProgressBar
        current={event.progress?.current || 0}
        total={event.progress?.total || 1}
        position={{ left: '84px', bottom: '44px' }}
        width="157px"
      />
      
      {/* 이벤트 기간 (종료일만 표시) */}
      <p className="absolute left-[84px] bottom-[16px] text-[#222222] font-normal text-[12px] leading-[16px] tracking-[-0.02em]">
        ~ {event.endDate}
      </p>
      
      {/* 버튼 (보상 받기, 완료, 또는 진행도) */}
      <AchievementButton 
        type={getButtonType()}
        status={event.status}
        current={event.progress?.current}
        total={event.progress?.total}
      />
    </div>
  );
} 