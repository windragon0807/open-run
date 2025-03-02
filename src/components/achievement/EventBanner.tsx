'use client'

import { useState, useEffect } from 'react'
import { EventAchievementType } from '@/types/achievement'
import { AchievementButton, AchievementButtonType, ProgressBar } from './buttons'

/**
 * 이벤트 배너 아이템 Props
 */
interface EventBannerItemProps {
  /** 이벤트 도전과제 */
  event: EventAchievementType
}

/**
 * 이벤트 배너 아이템 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
function EventBannerItem({ event }: EventBannerItemProps) {
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

/**
 * 이벤트 배너 슬라이더 Props
 */
interface EventBannerSliderProps {
  /** 이벤트 도전과제 목록 */
  events: EventAchievementType[]
}

/** 자동으로 이벤트 배너를 슬라이드 시키는 간격 */
const AUTO_SLIDE_INTERVAL = 5000;

/**
 * 이벤트 배너 슬라이더 컴포넌트 (전체 탭용)
 * 
 * @param props - 컴포넌트 Props
 */
function EventBannerSlider({ events }: EventBannerSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 자동 슬라이드 효과
  useEffect(() => {
    if (events.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, AUTO_SLIDE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [events.length]);

  if (events.length === 0) return null;

  return (
    <div className="w-[328px] mx-auto">
      {/* 이벤트 배너 슬라이더 */}
      <div className="relative w-full h-[134px]">
        {events.map((event, index) => (
          <div 
            key={event.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <EventBannerItem event={event} />
          </div>
        ))}
      </div>
      
      {/* 인디케이터 */}
      {events.length > 1 && (
        <div className="flex justify-center gap-[6px] mt-[8px]">
          {events.map((_, index) => (
            <button
              key={index}
              className={`w-[8px] h-[8px] rounded-full ${
                currentSlide === index ? 'bg-[#222222]' : 'bg-[#DEE2E6]'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`배너 ${index + 1}로 이동`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 이벤트 배너 리스트 Props
 */
interface EventBannerListProps {
  /** 이벤트 도전과제 목록 */
  events: EventAchievementType[]
}

/**
 * 이벤트 배너 리스트 컴포넌트 (이벤트 탭용)
 * 
 * @param props - 컴포넌트 Props
 */
function EventBannerList({ events }: EventBannerListProps) {
  if (events.length === 0) return null;

  return (
    <div className="w-[328px] mx-auto">
      {events.map((event) => (
        <div key={event.id} className="mb-[8px]">
          <EventBannerItem event={event} />
        </div>
      ))}
    </div>
  );
}

/**
 * 이벤트 배너 Props
 */
interface EventBannerProps {
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
  /** 표시 모드 (기본값: slider) */
  mode?: 'slider' | 'list'
}

/**
 * 이벤트 도전과제 배너 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export default function EventBanner({ 
  eventAchievements, 
  mode = 'slider' 
}: EventBannerProps) {
  // 이벤트가 없는 경우 렌더링하지 않음
  if (!eventAchievements.length) return null;

  return (
    <div className="mt-[20px]">
      {mode === 'slider' ? (
        <EventBannerSlider events={eventAchievements} />
      ) : (
        <EventBannerList events={eventAchievements} />
      )}
    </div>
  );
} 