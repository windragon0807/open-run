'use client'

import { EventAchievementType } from '@/types/achievement'
import { EventBannerItem } from './EventBannerItem'
import { useEventBannerSlider } from './useEventBannerSlider'

/**
 * 이벤트 배너 슬라이더 Props
 */
export interface EventBannerSliderProps {
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
}

/**
 * 이벤트 배너 슬라이더 컴포넌트 (전체 탭용)
 * 
 * @param props - 컴포넌트 Props
 */
export function EventBannerSlider({ eventAchievements }: EventBannerSliderProps) {
  const {
    currentSlide,
    prevSlideIndex,
    nextSlideIndex,
    sliderRef,
    isSwiping,
    isAnimating,
    getSliderTransform,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleIndicatorClick
  } = useEventBannerSlider(eventAchievements);

  if (eventAchievements.length === 0) return null;

  return (
    <div className="w-[328px] mx-auto">
      {/* 이벤트 배너 슬라이더 */}
      <div 
        className="relative w-full h-[134px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isSwiping ? 'grabbing' : 'grab' }}
      >
        {/* 슬라이드 컨테이너 */}
        <div 
          ref={sliderRef}
          className="flex absolute w-[300%] h-full" 
          style={{
            transform: `translateX(${getSliderTransform()}%)`,
            transition: (isSwiping ? 'none' : 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)'),
            willChange: 'transform'
          }}
        >
          {/* 이전 슬라이드 */}
          <div 
            className="w-1/3 h-full flex-shrink-0 flex items-center justify-center event-banner-prev-slide"
            style={{
              transition: 'opacity 300ms ease-out',
              opacity: isAnimating && prevSlideIndex === currentSlide ? 1 : 0.9,
              willChange: 'opacity'
            }}
          >
            <div 
              className="h-full w-full px-[2px] event-banner-item" 
              data-index={prevSlideIndex}
              style={{
                transition: 'transform 150ms ease-out, opacity 250ms ease-out',
                willChange: 'transform, opacity'
              }}
            >
              <EventBannerItem 
                event={eventAchievements[prevSlideIndex]} 
                className={isAnimating ? 'pointer-events-none' : ''}
              />
            </div>
          </div>
          
          {/* 현재 슬라이드 */}
          <div 
            className="w-1/3 h-full flex-shrink-0 flex items-center justify-center event-banner-current-slide"
            style={{ zIndex: 1 }}
          >
            <div 
              className="h-full w-full px-[2px] event-banner-item" 
              data-index={currentSlide}
              style={{
                transition: 'transform 150ms ease-out, opacity 200ms ease-out',
                willChange: 'transform, opacity'
              }}  
            >
              <EventBannerItem 
                event={eventAchievements[currentSlide]} 
                className={isAnimating ? 'pointer-events-none' : ''}
              />
            </div>
          </div>
          
          {/* 다음 슬라이드 */}
          <div 
            className="w-1/3 h-full flex-shrink-0 flex items-center justify-center event-banner-next-slide"
            style={{
              transition: 'opacity 300ms ease-out',
              opacity: isAnimating && nextSlideIndex === currentSlide ? 1 : 0.9,
              willChange: 'opacity'
            }}
          >
            <div 
              className="h-full w-full px-[2px] event-banner-item" 
              data-index={nextSlideIndex}
              style={{
                transition: 'transform 150ms ease-out, opacity 250ms ease-out',
                willChange: 'transform, opacity'
              }}
            >
              <EventBannerItem 
                event={eventAchievements[nextSlideIndex]} 
                className={isAnimating ? 'pointer-events-none' : ''}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 인디케이터 */}
      {eventAchievements.length > 1 && (
        <div className="flex justify-center gap-[6px] mt-[8px]">
          {eventAchievements.map((_, index) => (
            <button
              key={index}
              className={`w-[8px] h-[8px] rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-[#222222]' : 'bg-[#DEE2E6]'
              } ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`배너 ${index + 1}로 이동`}
              disabled={isAnimating}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
} 