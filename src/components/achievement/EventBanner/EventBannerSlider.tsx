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
    isAutoSlideActive,
    getSliderTransform,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleIndicatorClick,
  } = useEventBannerSlider(eventAchievements)

  if (eventAchievements.length === 0) return null

  return (
    <div className='mx-auto w-full'>
      {/* 이벤트 배너 슬라이더 */}
      <div
        className='relative h-[134px] w-full overflow-hidden'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isSwiping ? 'grabbing' : 'grab' }}>
        {/* 슬라이드 컨테이너 */}
        <div
          ref={sliderRef}
          className='absolute flex h-full w-[300%]'
          style={{
            transform: `translateX(${getSliderTransform()}%)`,
            transition: isSwiping ? 'none' : 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform',
          }}>
          {/* 이전 슬라이드 */}
          <div
            className='event-banner-prev-slide flex h-full w-1/3 flex-shrink-0 items-center justify-center'
            style={{
              transition: 'opacity 300ms ease-out',
              opacity: isAnimating && prevSlideIndex === currentSlide ? 1 : 0.9,
              willChange: 'opacity',
            }}>
            <div
              className='event-banner-item h-full w-full px-[2px]'
              data-index={prevSlideIndex}
              style={{
                transition: 'transform 150ms ease-out, opacity 250ms ease-out',
                willChange: 'transform, opacity',
              }}>
              <EventBannerItem
                event={eventAchievements[prevSlideIndex]}
                className={isAnimating ? 'pointer-events-none' : ''}
              />
            </div>
          </div>

          {/* 현재 슬라이드 */}
          <div
            className='event-banner-current-slide flex h-full w-1/3 flex-shrink-0 items-center justify-center'
            style={{ zIndex: 1 }}>
            <div
              className='event-banner-item h-full w-full px-[2px]'
              data-index={currentSlide}
              style={{
                transition: 'transform 150ms ease-out, opacity 200ms ease-out',
                willChange: 'transform, opacity',
              }}>
              <EventBannerItem
                event={eventAchievements[currentSlide]}
                className={isAnimating ? 'pointer-events-none' : ''}
              />
            </div>
          </div>

          {/* 다음 슬라이드 */}
          <div
            className='event-banner-next-slide flex h-full w-1/3 flex-shrink-0 items-center justify-center'
            style={{
              transition: 'opacity 300ms ease-out',
              opacity: isAnimating && nextSlideIndex === currentSlide ? 1 : 0.9,
              willChange: 'opacity',
            }}>
            <div
              className='event-banner-item h-full w-full px-[2px]'
              data-index={nextSlideIndex}
              style={{
                transition: 'transform 150ms ease-out, opacity 250ms ease-out',
                willChange: 'transform, opacity',
              }}>
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
        <div className='mt-[8px] flex justify-center gap-[6px]'>
          {eventAchievements.map((_, index) => (
            <button
              key={index}
              className={`h-[8px] w-[8px] rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-[#222222]' : 'bg-[#DEE2E6]'
              } ${isAnimating ? 'opacity-50' : 'opacity-100'} ${
                isAutoSlideActive && currentSlide === index ? 'animate-pulse' : ''
              }`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`배너 ${index + 1}로 이동`}
              disabled={isAnimating}
              style={{
                boxShadow: isAutoSlideActive && currentSlide === index ? '0 0 8px rgba(34, 34, 34, 0.3)' : 'none',
              }}></button>
          ))}
        </div>
      )}
    </div>
  )
}
