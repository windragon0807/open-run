'use client'

import { EventAchievementType } from '@/types/achievement'
import { AchievementButton, AchievementButtonType, ProgressBar } from '../buttons'

/**
 * 이벤트 배너 아이템 Props
 */
export interface EventBannerItemProps {
  /** 이벤트 도전과제 */
  event: EventAchievementType
  /** 클릭 핸들러 (선택 사항) */
  onClick?: (event: EventAchievementType) => void
  /** 추가 클래스명 */
  className?: string
}

/**
 * 이벤트 배너 아이템 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function EventBannerItem({ 
  event, 
  onClick, 
  className = '' 
}: EventBannerItemProps) {
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

  /**
   * 이벤트 배너 클릭 핸들러
   */
  const handleClick = () => {
    if (onClick) onClick(event);
  };

  return (
    <div 
      className={`bg-[#ADB5BD] rounded-[10px] w-full h-[134px] flex relative shadow-floating-primary ${isCompleted ? 'opacity-60' : ''} ${className}`}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
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
      
      {/* 이벤트 콘텐츠 영역 */}
      <div className="flex-1 ml-[8px] relative">
        {/* 이벤트 제목과 설명 */}
        <div className="mt-[22px]">
          <h3 className="text-[#222222] font-bold text-[14px] leading-[20px] tracking-[-0.02em] truncate max-w-[160px]">
            {event.title}
          </h3>
          
          <p className="text-[#222222] font-normal text-[12px] leading-[16px] tracking-[-0.02em] truncate max-w-[160px]">
            {event.description}
          </p>
        </div>
        
        {/* 하단 정보 영역 */}
        <div className="absolute bottom-[16px] left-0 right-[16px] flex items-center justify-between">
          <div className="flex-1 mr-[11px]">
            {/* 진행도 표시 선 */}
            <ProgressBar
              current={event.progress?.current || 0}
              total={event.progress?.total || 1}
              width="100%"
            />
            
            {/* 이벤트 기간 (종료일만 표시) */}
            <p className="mt-[12px] text-[#222222] font-normal text-[12px] leading-[16px] tracking-[-0.02em]">
              ~ {event.endDate}
            </p>
          </div>
          
          {/* 버튼 (달성도 우측 11px, 배너 하단 16px) */}
          <AchievementButton 
            type={getButtonType()}
            status={event.status}
            current={event.progress?.current}
            total={event.progress?.total}
          />
        </div>
      </div>
    </div>
  );
} 