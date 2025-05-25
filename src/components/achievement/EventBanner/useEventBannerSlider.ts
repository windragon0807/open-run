'use client'

import { EventAchievementType } from '@/types/achievement'
import { useCallback, useEffect, useRef, useState } from 'react'

/** 자동으로 이벤트 배너를 슬라이드 시키는 간격 */
const AUTO_SLIDE_INTERVAL = 5000

/** 사용자 상호작용 후 자동 슬라이드 재개까지의 지연 시간 */
const AUTO_SLIDE_RESUME_DELAY = 3000

/** 스와이프 감지를 위한 최소 이동 거리 (px) */
const MIN_SWIPE_DISTANCE = 50

/**
 * 이벤트 배너 슬라이더 훅의 반환 타입
 */
export interface UseEventBannerSliderReturn {
  /** 현재 슬라이드 인덱스 */
  currentSlide: number
  /** 이전 슬라이드 인덱스 */
  prevSlideIndex: number
  /** 다음 슬라이드 인덱스 */
  nextSlideIndex: number
  /** 타겟 슬라이드 인덱스 (인디케이터 클릭용) */
  targetSlideIndex: number | null
  /** 슬라이드 컨테이너의 ref */
  sliderRef: React.RefObject<HTMLDivElement>
  /** 드래그 중인지 여부 */
  isSwiping: boolean
  /** 애니메이션 중인지 여부 */
  isAnimating: boolean
  /** 자동 슬라이드 활성화 여부 */
  isAutoSlideActive: boolean
  /** 드래그 오프셋 */
  dragOffset: number
  /** 이동 방향 */
  direction: 'next' | 'prev' | 'direct' | null
  /** 슬라이더 변환 위치 계산 함수 */
  getSliderTransform: () => number
  /** 터치 시작 핸들러 */
  handleTouchStart: (e: React.TouchEvent) => void
  /** 터치 이동 핸들러 */
  handleTouchMove: (e: React.TouchEvent) => void
  /** 터치 종료 핸들러 */
  handleTouchEnd: (e: React.TouchEvent) => void
  /** 마우스 다운 핸들러 */
  handleMouseDown: (e: React.MouseEvent) => void
  /** 마우스 이동 핸들러 */
  handleMouseMove: (e: React.MouseEvent) => void
  /** 마우스 업 핸들러 */
  handleMouseUp: (e: React.MouseEvent) => void
  /** 마우스 이탈 핸들러 */
  handleMouseLeave: () => void
  /** 인디케이터 클릭 핸들러 */
  handleIndicatorClick: (index: number) => void
}

/**
 * 이벤트 배너 슬라이더 훅
 *
 * @param eventAchievements - 이벤트 도전과제 목록
 * @returns 슬라이더 상태 및 이벤트 핸들러
 */
export function useEventBannerSlider(eventAchievements: EventAchievementType[]): UseEventBannerSliderReturn {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev' | 'direct' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [targetSlideIndex, setTargetSlideIndex] = useState<number | null>(null)
  const [isAutoSlideActive, setIsAutoSlideActive] = useState(true)

  // 슬라이더 컨테이너 요소 참조
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const autoSlideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 스와이프 관련 상태
  const touchStartX = useRef<number | null>(null)
  const touchCurrentX = useRef<number | null>(null)
  const sliderWidth = useRef<number>(0)

  // 슬라이더 초기화
  useEffect(() => {
    if (sliderRef.current) {
      sliderWidth.current = sliderRef.current.offsetWidth / 3

      // 슬라이더 너비 초기화 후 리사이즈 이벤트 리스너 등록
      const handleResize = () => {
        if (sliderRef.current) {
          sliderWidth.current = sliderRef.current.offsetWidth / 3
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // transitionend 이벤트 리스너 설정
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const handleTransitionEnd = () => {
      if (!isAnimating) {
        return
      }

      // 애니메이션이 완료되면 즉시 transition을 비활성화하고 위치 재설정
      slider.style.transition = 'none'

      // 현재 슬라이드 인덱스 업데이트
      if (direction === 'direct' && targetSlideIndex !== null) {
        // 직접 이동의 경우 targetSlideIndex로 설정
        setCurrentSlide(targetSlideIndex)
        setTargetSlideIndex(null)
      } else if (direction === 'next') {
        const nextSlide = (currentSlide + 1) % eventAchievements.length
        setCurrentSlide(nextSlide)
      } else if (direction === 'prev') {
        const prevSlide = currentSlide === 0 ? eventAchievements.length - 1 : currentSlide - 1
        setCurrentSlide(prevSlide)
      }

      // 드래그 오프셋 초기화
      setDragOffset(0)

      // 슬라이더 위치 즉시 재설정 (깜빡임 방지를 위해 DOM 요소 업데이트 전에 실행)
      slider.style.transform = `translateX(-33.33%)`

      // 애니메이션 상태 및 방향 초기화 후에 transition 속성 복원
      requestAnimationFrame(() => {
        setIsAnimating(false)
        setDirection(null)

        // transition 속성 복원 (약간 지연시켜 깜빡임 방지)
        setTimeout(() => {
          if (slider) {
            slider.style.transition = ''
          }
        }, 50)
      })
    }

    slider.addEventListener('transitionend', handleTransitionEnd)

    return () => {
      slider.removeEventListener('transitionend', handleTransitionEnd)
    }
  }, [direction, eventAchievements.length, isAnimating, targetSlideIndex, currentSlide])

  // 다음 슬라이드로 이동
  const goToNextSlide = useCallback(() => {
    if (isAnimating || eventAchievements.length <= 1) {
      return
    }

    setDirection('next')
    setIsAnimating(true)

    // 실제 CSS transform 적용
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)'
      sliderRef.current.style.transform = 'translateX(-66.67%)'
    }
  }, [eventAchievements.length, isAnimating])

  // 이전 슬라이드로 이동
  const goToPrevSlide = useCallback(() => {
    if (isAnimating || eventAchievements.length <= 1) {
      return
    }

    setDirection('prev')
    setIsAnimating(true)

    // 실제 CSS transform 적용
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)'
      sliderRef.current.style.transform = 'translateX(0%)'
    }
  }, [eventAchievements.length, isAnimating])

  // 자동 슬라이드 일시 정지 함수
  const pauseAutoSlide = useCallback(() => {
    setIsAutoSlideActive(false)

    // 기존 타이머 제거
    if (autoSlideTimeoutRef.current) {
      clearTimeout(autoSlideTimeoutRef.current)
    }

    // 3초 후 자동 슬라이드 재개
    autoSlideTimeoutRef.current = setTimeout(() => {
      setIsAutoSlideActive(true)
    }, AUTO_SLIDE_RESUME_DELAY)
  }, [])

  // 터치 시작 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isAnimating) return

      // 사용자 상호작용 시 자동 슬라이드 일시 정지
      pauseAutoSlide()

      touchStartX.current = e.touches[0].clientX
      touchCurrentX.current = e.touches[0].clientX
      setIsSwiping(true)
      setDragOffset(0)

      // 트랜지션 일시 중지
      if (sliderRef.current) {
        sliderRef.current.style.transition = 'none'
      }
    },
    [isAnimating, pauseAutoSlide],
  )

  // 터치 이동 핸들러
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartX.current || !isSwiping || isAnimating) return

      touchCurrentX.current = e.touches[0].clientX
      const diff = touchCurrentX.current - touchStartX.current

      // 최대 슬라이더 너비의 80%까지만 드래그 가능
      const maxDrag = sliderWidth.current * 0.8
      const constrainedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag)

      setDragOffset(constrainedDiff)
    },
    [isAnimating, isSwiping],
  )

  // 터치 종료 핸들러
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartX.current || !touchCurrentX.current || !isSwiping) return

      // 스와이프 거리 계산
      const swipeDistance = touchCurrentX.current - touchStartX.current

      // 트랜지션 다시 활성화
      if (sliderRef.current) {
        sliderRef.current.style.transition = 'transform 300ms ease-out'
      }

      // 스와이프 방향에 따라 이전/다음 슬라이드로 이동
      if (Math.abs(swipeDistance) > MIN_SWIPE_DISTANCE) {
        if (swipeDistance > 0) {
          // 오른쪽으로 스와이프 (왼쪽에서 오른쪽으로) -> 이전 슬라이드로 이동
          goToPrevSlide()
        } else {
          // 왼쪽으로 스와이프 (오른쪽에서 왼쪽으로) -> 다음 슬라이드로 이동
          goToNextSlide()
        }
      } else {
        // MIN_SWIPE_DISTANCE보다 작으면 원래 위치로 복귀
        setDragOffset(0)
      }

      // 터치 좌표 초기화
      touchStartX.current = null
      touchCurrentX.current = null
      setIsSwiping(false)
    },
    [goToNextSlide, goToPrevSlide, isSwiping],
  )

  // 마우스 다운 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isAnimating) return

      // 사용자 상호작용 시 자동 슬라이드 일시 정지
      pauseAutoSlide()

      touchStartX.current = e.clientX
      touchCurrentX.current = e.clientX
      setIsSwiping(true)
      setDragOffset(0)

      // 트랜지션 일시 중지
      if (sliderRef.current) {
        sliderRef.current.style.transition = 'none'
      }

      // 드래그 중 텍스트 선택 방지
      e.preventDefault()
    },
    [isAnimating, pauseAutoSlide],
  )

  // 마우스 이동 핸들러
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!touchStartX.current || !isSwiping || isAnimating) return

      touchCurrentX.current = e.clientX
      const diff = touchCurrentX.current - touchStartX.current

      // 최대 슬라이더 너비의 80%까지만 드래그 가능
      const maxDrag = sliderWidth.current * 0.8
      const constrainedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag)

      setDragOffset(constrainedDiff)

      // 드래그 중 텍스트 선택 방지
      e.preventDefault()
    },
    [isAnimating, isSwiping],
  )

  // 마우스 업 핸들러
  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!touchStartX.current || !touchCurrentX.current || !isSwiping) return

      // 스와이프 거리 계산
      const swipeDistance = touchCurrentX.current - touchStartX.current

      // 트랜지션 다시 활성화
      if (sliderRef.current) {
        sliderRef.current.style.transition = 'transform 300ms ease-out'
      }

      // 스와이프 방향에 따라 이전/다음 슬라이드로 이동
      if (Math.abs(swipeDistance) > MIN_SWIPE_DISTANCE) {
        if (swipeDistance > 0) {
          // 오른쪽으로 스와이프 (왼쪽에서 오른쪽으로) -> 이전 슬라이드로 이동
          goToPrevSlide()
        } else {
          // 왼쪽으로 스와이프 (오른쪽에서 왼쪽으로) -> 다음 슬라이드로 이동
          goToNextSlide()
        }
      } else {
        // MIN_SWIPE_DISTANCE보다 작으면 원래 위치로 복귀
        setDragOffset(0)
      }

      // 터치 좌표 초기화
      touchStartX.current = null
      touchCurrentX.current = null
      setIsSwiping(false)
    },
    [goToNextSlide, goToPrevSlide, isSwiping],
  )

  // 마우스가 슬라이더 영역을 벗어날 때 핸들러
  const handleMouseLeave = useCallback(() => {
    if (!isSwiping) return

    // 드래그 중에 영역을 벗어나면 원래 위치로 복귀
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 300ms ease-out'
    }
    setDragOffset(0)

    // 스와이프 상태 초기화
    touchStartX.current = null
    touchCurrentX.current = null
    setIsSwiping(false)
  }, [isSwiping])

  // 인디케이터 클릭 핸들러
  const handleIndicatorClick = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSlide) return

      // 사용자 상호작용 시 자동 슬라이드 일시 정지
      pauseAutoSlide()

      // 슬라이더 요소가 있는 경우에만 처리
      if (sliderRef.current) {
        // 여러 칸 이동 시 처리 방법
        const distance = Math.abs(index - currentSlide)
        const isDirectJump = distance > 1

        // 이동 방향 설정
        const newDirection = isDirectJump ? 'direct' : index > currentSlide ? 'next' : 'prev'
        setDirection(newDirection)
        setIsAnimating(true)

        // 직접 이동할 경우 타겟 인덱스 저장
        if (isDirectJump) {
          setTargetSlideIndex(index)
        }

        // 트랜지션 다시 활성화하고 방향에 따라 슬라이더 이동
        sliderRef.current.style.transition = 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)'
        sliderRef.current.style.transform = index > currentSlide ? 'translateX(-66.67%)' : 'translateX(0%)'
      }
    },
    [currentSlide, isAnimating, pauseAutoSlide],
  )

  // 자동 슬라이드 효과 (5초 간격)
  useEffect(() => {
    if (eventAchievements.length <= 1 || !isAutoSlideActive || isAnimating || isSwiping) {
      return
    }

    const interval = setInterval(() => {
      // 사용자가 상호작용 중이 아닐 때만 자동 슬라이드 실행
      if (isAutoSlideActive && !isAnimating && !isSwiping) {
        goToNextSlide()
      }
    }, AUTO_SLIDE_INTERVAL)

    return () => {
      clearInterval(interval)
    }
  }, [eventAchievements.length, goToNextSlide, isAutoSlideActive, isAnimating, isSwiping, currentSlide])

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (autoSlideTimeoutRef.current) {
        clearTimeout(autoSlideTimeoutRef.current)
      }
    }
  }, [])

  // 다음 슬라이드 인덱스 계산
  const nextSlideIndex = (currentSlide + 1) % eventAchievements.length
  // 이전 슬라이드 인덱스 계산
  const prevSlideIndex = currentSlide === 0 ? eventAchievements.length - 1 : currentSlide - 1

  // 슬라이더의 transform 계산
  const getSliderTransform = useCallback(() => {
    // 기본 위치 (현재 슬라이드가 중앙에 위치)
    const basePosition = -33.33

    // 애니메이션 중이면 애니메이션 방향에 따라 위치 조정
    if (isAnimating) {
      return direction === 'next' ? -66.67 : 0
    }

    // 드래그 중이면 드래그 오프셋에 따라 위치 조정
    if (dragOffset !== 0) {
      // 슬라이더 너비에 대한 드래그 비율 계산
      const dragPercentage = (dragOffset / sliderWidth.current) * 33.33
      return basePosition + dragPercentage
    }

    // 기본 위치
    return basePosition
  }, [direction, dragOffset, isAnimating])

  return {
    currentSlide,
    prevSlideIndex,
    nextSlideIndex,
    targetSlideIndex,
    sliderRef,
    isSwiping,
    isAnimating,
    isAutoSlideActive,
    dragOffset,
    direction,
    getSliderTransform,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleIndicatorClick,
  }
}
