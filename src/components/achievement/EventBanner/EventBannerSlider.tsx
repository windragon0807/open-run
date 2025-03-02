'use client'

import { useState, useEffect } from 'react'
import { EventAchievementType } from '@/types/achievement'
import { EventBannerItem } from './EventBannerItem'

/**
 * 이벤트 배너 슬라이더 Props
 */
export interface EventBannerSliderProps {
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
}

/** 자동으로 이벤트 배너를 슬라이드 시키는 간격 */
const AUTO_SLIDE_INTERVAL = 5000;

/**
 * 이벤트 배너 슬라이더 컴포넌트 (전체 탭용)
 * 
 * @param props - 컴포넌트 Props
 */
export function EventBannerSlider({ eventAchievements }: EventBannerSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 자동 슬라이드 효과
  useEffect(() => {
    if (eventAchievements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventAchievements.length);
    }, AUTO_SLIDE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [eventAchievements.length]);

  if (eventAchievements.length === 0) return null;

  return (
    <div className="w-[328px] mx-auto">
      {/* 이벤트 배너 슬라이더 */}
      <div className="relative w-full h-[134px]">
        {eventAchievements.map((event, index) => (
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
      {eventAchievements.length > 1 && (
        <div className="flex justify-center gap-[6px] mt-[8px]">
          {eventAchievements.map((_, index) => (
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