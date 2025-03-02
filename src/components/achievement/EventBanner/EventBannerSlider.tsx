'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

/** 스와이프 감지를 위한 최소 이동 거리 (px) */
const MIN_SWIPE_DISTANCE = 50;

/**
 * 이벤트 배너 슬라이더 컴포넌트 (전체 탭용)
 * 
 * @param props - 컴포넌트 Props
 */
export function EventBannerSlider({ eventAchievements }: EventBannerSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  // 슬라이더 컨테이너 요소 참조
  const sliderRef = useRef<HTMLDivElement | null>(null);
  
  // 스와이프 관련 상태
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const sliderWidth = useRef<number>(0);
  
  // 슬라이더 초기화
  useEffect(() => {
    if (sliderRef.current) {
      sliderWidth.current = sliderRef.current.offsetWidth / 3;
    }
  }, []);
  
  // transitionend 이벤트 리스너 설정
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    const handleTransitionEnd = () => {
      if (!isAnimating) return;
      
      // 애니메이션이 끝나면 슬라이드 인덱스 변경
      if (direction === 'next') {
        setCurrentSlide((prev) => (prev + 1) % eventAchievements.length);
      } else if (direction === 'prev') {
        setCurrentSlide((prev) => 
          prev === 0 ? eventAchievements.length - 1 : prev - 1
        );
      }
      
      // 드래그 오프셋 초기화 및 애니메이션 상태 종료
      setDragOffset(0);
      setIsAnimating(false);
      setDirection(null);
    };
    
    slider.addEventListener('transitionend', handleTransitionEnd);
    
    return () => {
      slider.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [direction, eventAchievements.length, isAnimating]);
  
  // 다음 슬라이드로 이동
  const goToNextSlide = useCallback(() => {
    if (isAnimating || eventAchievements.length <= 1) return;
    
    setDirection('next');
    setIsAnimating(true);
  }, [eventAchievements.length, isAnimating]);
  
  // 이전 슬라이드로 이동
  const goToPrevSlide = useCallback(() => {
    if (isAnimating || eventAchievements.length <= 1) return;
    
    setDirection('prev');
    setIsAnimating(true);
  }, [eventAchievements.length, isAnimating]);
  
  // 터치 시작 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    setIsSwiping(true);
    setDragOffset(0);
    
    // 트랜지션 일시 중지
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
  };
  
  // 터치 이동 핸들러
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || !isSwiping || isAnimating) return;
    
    touchCurrentX.current = e.touches[0].clientX;
    const diff = (touchCurrentX.current - touchStartX.current);
    
    // 최대 슬라이더 너비의 80%까지만 드래그 가능
    const maxDrag = sliderWidth.current * 0.8;
    const constrainedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag);
    
    setDragOffset(constrainedDiff);
  };
  
  // 터치 종료 핸들러
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchCurrentX.current || !isSwiping) return;
    
    // 스와이프 거리 계산
    const swipeDistance = touchCurrentX.current - touchStartX.current;
    
    // 트랜지션 다시 활성화
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 300ms ease-out';
    }
    
    // 스와이프 방향에 따라 이전/다음 슬라이드로 이동
    if (Math.abs(swipeDistance) > MIN_SWIPE_DISTANCE) {
      if (swipeDistance > 0) {
        // 오른쪽으로 스와이프 (왼쪽에서 오른쪽으로) -> 이전 슬라이드로 이동
        goToPrevSlide();
      } else {
        // 왼쪽으로 스와이프 (오른쪽에서 왼쪽으로) -> 다음 슬라이드로 이동
        goToNextSlide();
      }
    } else {
      // MIN_SWIPE_DISTANCE보다 작으면 원래 위치로 복귀
      setDragOffset(0);
    }
    
    // 터치 좌표 초기화
    touchStartX.current = null;
    touchCurrentX.current = null;
    setIsSwiping(false);
  };
  
  // 마우스 다운 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating) return;
    
    touchStartX.current = e.clientX;
    touchCurrentX.current = e.clientX;
    setIsSwiping(true);
    setDragOffset(0);
    
    // 트랜지션 일시 중지
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
    
    // 드래그 중 텍스트 선택 방지
    e.preventDefault();
  };
  
  // 마우스 이동 핸들러
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!touchStartX.current || !isSwiping || isAnimating) return;
    
    touchCurrentX.current = e.clientX;
    const diff = (touchCurrentX.current - touchStartX.current);
    
    // 최대 슬라이더 너비의 80%까지만 드래그 가능
    const maxDrag = sliderWidth.current * 0.8;
    const constrainedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag);
    
    setDragOffset(constrainedDiff);
    
    // 드래그 중 텍스트 선택 방지
    e.preventDefault();
  };
  
  // 마우스 업 핸들러
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchStartX.current || !touchCurrentX.current || !isSwiping) return;
    
    // 스와이프 거리 계산
    const swipeDistance = touchCurrentX.current - touchStartX.current;
    
    // 트랜지션 다시 활성화
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 300ms ease-out';
    }
    
    // 스와이프 방향에 따라 이전/다음 슬라이드로 이동
    if (Math.abs(swipeDistance) > MIN_SWIPE_DISTANCE) {
      if (swipeDistance > 0) {
        // 오른쪽으로 스와이프 (왼쪽에서 오른쪽으로) -> 이전 슬라이드로 이동
        goToPrevSlide();
      } else {
        // 왼쪽으로 스와이프 (오른쪽에서 왼쪽으로) -> 다음 슬라이드로 이동
        goToNextSlide();
      }
    } else {
      // MIN_SWIPE_DISTANCE보다 작으면 원래 위치로 복귀
      setDragOffset(0);
    }
    
    // 터치 좌표 초기화
    touchStartX.current = null;
    touchCurrentX.current = null;
    setIsSwiping(false);
  };
  
  // 마우스가 슬라이더 영역을 벗어날 때 핸들러
  const handleMouseLeave = () => {
    if (!isSwiping) return;
    
    // 드래그 중에 영역을 벗어나면 원래 위치로 복귀
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 300ms ease-out';
    }
    setDragOffset(0);
    
    // 스와이프 상태 초기화
    touchStartX.current = null;
    touchCurrentX.current = null;
    setIsSwiping(false);
  };
  
  // 자동 슬라이드 효과
  useEffect(() => {
    if (eventAchievements.length <= 1) return;
    
    const interval = setInterval(() => {
      goToNextSlide();
    }, AUTO_SLIDE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [eventAchievements.length, goToNextSlide]);

  if (eventAchievements.length === 0) return null;

  // 다음 슬라이드 인덱스 계산
  const nextSlideIndex = (currentSlide + 1) % eventAchievements.length;
  // 이전 슬라이드 인덱스 계산
  const prevSlideIndex = currentSlide === 0 ? eventAchievements.length - 1 : currentSlide - 1;

  // 슬라이더의 transform 계산
  const getSliderTransform = () => {
    // 기본 위치 (현재 슬라이드가 중앙에 위치)
    const basePosition = -33.33;
    
    // 애니메이션 중이면 애니메이션 방향에 따라 위치 조정
    if (isAnimating) {
      return direction === 'next' ? -66.67 : 0;
    }
    
    // 드래그 중이면 드래그 오프셋에 따라 위치 조정
    if (dragOffset !== 0) {
      // 슬라이더 너비에 대한 드래그 비율 계산
      const dragPercentage = (dragOffset / sliderWidth.current) * 33.33;
      return basePosition + dragPercentage;
    }
    
    // 기본 위치
    return basePosition;
  };

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
            transition: (isAnimating || (!isSwiping && dragOffset !== 0)) 
              ? 'transform 300ms ease-out' 
              : 'none'
          }}
        >
          {/* 이전 슬라이드 */}
          <div className="w-1/3 h-full flex-shrink-0">
            <EventBannerItem event={eventAchievements[prevSlideIndex]} />
          </div>
          
          {/* 현재 슬라이드 */}
          <div className="w-1/3 h-full flex-shrink-0">
            <EventBannerItem event={eventAchievements[currentSlide]} />
          </div>
          
          {/* 다음 슬라이드 */}
          <div className="w-1/3 h-full flex-shrink-0">
            <EventBannerItem event={eventAchievements[nextSlideIndex]} />
          </div>
        </div>
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
              onClick={() => {
                if (isAnimating) return;
                
                const newDirection = index > currentSlide ? 'next' : 'prev';
                if (index === currentSlide) return;
                
                setDirection(newDirection);
                setIsAnimating(true);
              }}
              aria-label={`배너 ${index + 1}로 이동`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
} 