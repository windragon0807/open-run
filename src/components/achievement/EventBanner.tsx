'use client'

import { useState, useEffect } from 'react'
import { EventAchievementType } from '@/types/achievement'

/**
 * 이벤트 배너 Props
 */
interface EventBannerProps {
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
}

/** 자동으로 이벤트 배너를 슬라이드 시키는 간격 */
const AUTO_SLIDE_INTERVAL = 5000;

/**
 * 이벤트 도전과제 배너 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export default function EventBanner({ eventAchievements }: EventBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  
  // 자동 슬라이드 효과
  useEffect(() => {
    if (eventAchievements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventAchievements.length);
    }, AUTO_SLIDE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [eventAchievements.length]);

  // 이벤트가 없는 경우 렌더링하지 않음
  if (!eventAchievements.length) return null;

  return (
    <div className="mt-[20px] mx-auto w-[328px]">
      {/* 이벤트 배너 슬라이더 */}
      <div className="relative w-full h-[134px]">
        {eventAchievements.map((event, index) => (
          <div 
            key={event.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* 이벤트 도전과제 영역 */}
            <div className="bg-[#ADB5BD] rounded-[10px] w-full h-full flex relative">
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
                
                {/* 이벤트 기간 (종료일만 표시) */}
                <p className="text-[#222222] font-normal text-[12px] leading-[16px] mt-[4px]">
                  ~ {event.endDate}
                </p>
              </div>
              
              {/* 보상 받기 버튼 */}
              <button 
                className="absolute bottom-[16px] right-[16px] w-[60px] h-[40px] bg-[#4A5CEF] rounded-[8px] text-white font-bold text-[12px] leading-[16px] tracking-[-0.02em] text-center"
              >
                보상 받기
              </button>
            </div>
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