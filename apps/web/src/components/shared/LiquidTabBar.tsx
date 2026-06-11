'use client'

import { motion } from 'framer-motion'
import { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import GlassSurface from './GlassSurface'

export type LiquidTabItem = {
  key: string
  label: string
  renderIcon: (color: string) => ReactNode
}

type Props = {
  /** 좌측 2개 + 우측 2개 탭 (가운데는 centerVisual CTA 슬롯) */
  items: LiquidTabItem[]
  activeIndex: number
  onTabSelect: (index: number) => void
  onCenterTap: () => void
  /** 드래그 중 pill이 가장 가까운 탭을 갈아탈 때 (디텐트 진동용) */
  onSnap?: (index: number) => void
  centerVisual: ReactNode
  /** 가운데 CTA의 접근성 이름 */
  centerLabel?: string
}

const PILL_SPRING = { type: 'spring', stiffness: 320, damping: 28 } as const
const PRESS_SPRING = { type: 'spring', stiffness: 260, damping: 20 } as const
const SHRINK_SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const
/** 수평 이동이 이 값을 넘으면 탭이 아니라 드래그로 판정 */
const DRAG_START_THRESHOLD_PX = 10
/** 하향 스크롤이 이만큼 누적되면 바 축소 (바운스 지터 방지), 상향은 즉시 복원 */
const SHRINK_SCROLL_THRESHOLD_PX = 12
const PILL_WIDTH = 56
const TRACK_PADDING_X = 9

// 인스타식: pill은 은은한 다크 틴트라 글리프 반전이 필요 없다 — 활성은 잉크 점프(알파 0.56 → 1.0)만
const FOCUSED_GLYPH_COLOR = '#111111'
const INACTIVE_GLYPH_COLOR = 'rgba(34, 34, 34, 0.56)'

/**
 * 인스타그램식 liquid glass 탭바.
 * - 활성 탭 뒤 불투명 회색 pill이 spring으로 슬라이드
 * - 누르는 동안 바 1.04 확대(물방울), 드래그하면 pill이 손가락을 연속으로 따라오고
 *   중간에서 놓으면 가장 가까운 탭으로 스냅해 선택
 * - 하향 스크롤 시 0.88 축소 + 6px 침하, 상향 시 즉시 복원
 */
export default function LiquidTabBar({
  items,
  activeIndex,
  onTabSelect,
  onCenterTap,
  onSnap,
  centerVisual,
  centerLabel = '만들기',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const [pressed, setPressed] = useState(false)
  const [dragX, setDragX] = useState<number | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  /** 드래그/탭 선택 직후 라우터 반영(pathname 변경) 전까지 pill 위치를 선점하는 낙관적 인덱스 */
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)
  const [shrunk, setShrunk] = useState(false)
  const dragIndexRef = useRef<number | null>(null)
  const draggingRef = useRef(false)
  const suppressClickRef = useRef(false)
  const startXRef = useRef(0)

  // 라우터가 따라오면 낙관적 인덱스 해제
  useEffect(() => {
    setPendingIndex((prev) => (prev != null && prev === activeIndex ? null : prev))
  }, [activeIndex])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const resizeObserver = new ResizeObserver(() => setTrackWidth(el.clientWidth))
    resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }, [])

  // 페이지마다 스크롤 컨테이너가 달라서 capture 단계에서 모든 내부 스크롤을 감지한다
  useEffect(() => {
    const lastTops = new WeakMap<Element, number>()
    let downwardAcc = 0
    const handleScroll = (event: Event) => {
      const el = event.target instanceof Element ? event.target : document.documentElement
      const top = el.scrollTop
      const last = lastTops.get(el)
      lastTops.set(el, top)
      if (last == null) return
      const delta = top - last
      if (delta > 0) {
        downwardAcc += delta
        if (downwardAcc > SHRINK_SCROLL_THRESHOLD_PX) setShrunk(true)
      } else if (delta < 0) {
        downwardAcc = 0
        setShrunk(false)
      }
    }
    document.addEventListener('scroll', handleScroll, true)
    return () => document.removeEventListener('scroll', handleScroll, true)
  }, [])

  /* 좌표계: track 콘텐츠 영역(px-[9px] 안쪽)을 5등분한 슬롯. 탭 i ↔ 슬롯(가운데 CTA = 슬롯 2) */
  const contentWidth = trackWidth - TRACK_PADDING_X * 2
  const tabSlot = (tabIndex: number) => (tabIndex < 2 ? tabIndex : tabIndex + 1)
  const slotCenterX = (slot: number) => TRACK_PADDING_X + (contentWidth * (slot + 0.5)) / 5

  /* x 좌표 → 가장 가까운 탭. CTA 존(슬롯 2)은 50/50로 분할해 인접 탭으로 —
     경계값들이 탭 중심 간 중점과 일치해서 "가까운 쪽" 판정과 동치다 */
  const nearestTabFromX = (trackX: number) => {
    const ratio = (trackX - TRACK_PADDING_X) / contentWidth
    if (ratio < 2.5 / 5) return ratio < 1 / 5 ? 0 : 1
    return ratio < 4 / 5 ? 2 : 3
  }

  const slotFromX = (trackX: number) => {
    if (contentWidth <= 0) return -1
    return Math.min(4, Math.max(0, Math.floor(((trackX - TRACK_PADDING_X) / contentWidth) * 5)))
  }

  const trackXFromEvent = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return 0
    // 바가 scale 중일 수 있어 비율로 환산해 레이아웃 좌표로 되돌린다
    return ((event.clientX - rect.left) / rect.width) * trackWidth
  }

  const focusIndex = dragIndex ?? pendingIndex ?? activeIndex
  const pillTargetX =
    (dragX ?? (focusIndex >= 0 ? slotCenterX(tabSlot(focusIndex)) : 0)) - PILL_WIDTH / 2

  const resetDrag = () => {
    draggingRef.current = false
    dragIndexRef.current = null
    setDragIndex(null)
    setDragX(null)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    setPressed(true)
    setShrunk(false) // 축소 상태에서 누르면 즉시 복원
    startXRef.current = event.clientX
    draggingRef.current = false
    suppressClickRef.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    if (!draggingRef.current && Math.abs(event.clientX - startXRef.current) <= DRAG_START_THRESHOLD_PX) return
    draggingRef.current = true
    // pill이 손가락 x를 연속으로 따라온다 (양끝 탭 중심 밖으로는 못 나감)
    const trackX = Math.min(slotCenterX(4), Math.max(slotCenterX(0), trackXFromEvent(event)))
    setDragX(trackX)
    const index = nearestTabFromX(trackX)
    if (dragIndexRef.current !== index) {
      dragIndexRef.current = index
      setDragIndex(index)
      onSnap?.(index)
    }
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    setPressed(false)
    suppressClickRef.current = true // pointer 경로로 처리했으니 뒤따르는 click은 무시
    if (draggingRef.current) {
      // 중간에서 놓으면 가장 가까운 탭으로 스냅하며 마무리
      const nearest = nearestTabFromX(trackXFromEvent(event))
      setPendingIndex(nearest)
      if (nearest !== activeIndex) onTabSelect(nearest)
    } else {
      const slot = slotFromX(trackXFromEvent(event))
      if (slot === 2) onCenterTap()
      else if (slot >= 0) {
        const tabIndex = slot < 2 ? slot : slot - 1
        setPendingIndex(tabIndex)
        onTabSelect(tabIndex)
      }
    }
    resetDrag()
  }

  const handlePointerCancel = () => {
    setPressed(false)
    resetDrag()
  }

  /* pointer 경로로 이미 처리한 탭의 후속 click은 track 레벨 capture에서 통째로 소비한다 —
     버튼별 소비 방식은 click이 버튼 밖(track)에 떨어지면 플래그가 남아 다음 키보드 입력을 먹는다 */
  const handleTrackClickCapture = (event: ReactMouseEvent) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      event.preventDefault()
      event.stopPropagation()
    }
  }

  // 여기 도달하는 click은 전부 비포인터 입력(키보드 Enter/Space, 보조기기 합성 클릭) — 무조건 활성화
  const handleTabClick = (tabIndex: number) => () => {
    setPendingIndex(tabIndex)
    onTabSelect(tabIndex)
  }

  const renderTab = (tabIndex: number) => {
    const item = items[tabIndex]
    const glyphColor = focusIndex === tabIndex ? FOCUSED_GLYPH_COLOR : INACTIVE_GLYPH_COLOR
    return (
      <button
        key={item.key}
        type='button'
        className='relative z-10 flex h-full flex-1 items-center justify-center'
        aria-current={activeIndex === tabIndex ? 'page' : undefined}
        onClick={handleTabClick(tabIndex)}>
        <span className='flex flex-col items-center justify-center'>
          {item.renderIcon(glyphColor)}
          <span className='text-10 font-medium transition-colors duration-150' style={{ color: glyphColor }}>
            {item.label}
          </span>
        </span>
      </button>
    )
  }

  return (
    <motion.div
      className='w-full max-w-[328px]'
      style={{ transformOrigin: 'center bottom' }}
      animate={{ scale: pressed ? 1.04 : shrunk ? 0.88 : 1, y: shrunk && !pressed ? 6 : 0 }}
      transition={pressed ? PRESS_SPRING : SHRINK_SPRING}>
      <GlassSurface
        width='100%'
        height={56}
        borderRadius={28}
        borderWidth={0.12}
        backgroundOpacity={0.55}
        distortionScale={-135}
        displace={7}
        greenOffset={6}
        blueOffset={12}
        saturation={1.8}
        blur={6}>
        <div
          ref={trackRef}
          className='relative flex h-full w-full touch-none items-center justify-between px-[9px]'
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClickCapture={handleTrackClickCapture}>
          {/* 단일 pill이 x 좌표를 spring으로 추적 — 드래그 중엔 손가락을 연속으로 따라온다 */}
          {trackWidth > 0 && focusIndex >= 0 && (
            <motion.span
              initial={false}
              animate={{ x: pillTargetX, scale: dragX != null ? 1.08 : 1 }}
              transition={PILL_SPRING}
              className='pointer-events-none absolute left-0 top-1/2 -mt-22 h-44 w-56 rounded-full bg-black/[0.07]'
            />
          )}
          {renderTab(0)}
          {renderTab(1)}
          {/* CTA도 실제 button이어야 키보드·스크린리더로 도달 가능하다 (포인터 탭은 track pointerup이 처리) */}
          <button
            type='button'
            aria-label={centerLabel}
            className='relative z-10 flex h-full flex-1 items-center justify-center'
            onClick={() => onCenterTap()}>
            {centerVisual}
          </button>
          {renderTab(2)}
          {renderTab(3)}
        </div>
      </GlassSurface>
    </motion.div>
  )
}

/** 가운데 CTA 기본 비주얼: 라임 틴트를 얹은 글래스 렌즈 (탭은 바가 처리하므로 비인터랙티브) */
export function LiquidCenterVisual({ children }: { children: ReactNode }) {
  return (
    <div className='relative size-36'>
      <GlassSurface
        width={36}
        height={36}
        borderRadius={18}
        borderWidth={0.16}
        backgroundOpacity={0.15}
        distortionScale={-100}
        displace={1}
        greenOffset={4}
        blueOffset={8}
        saturation={1.5}
        blur={4}
        className='absolute inset-0 ring-1 ring-inset ring-white/60'
      />
      <div className='absolute inset-0 z-10 flex items-center justify-center rounded-full bg-secondary/70 ring-1 ring-inset ring-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]'>
        {children}
      </div>
    </div>
  )
}
