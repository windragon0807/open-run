'use client'

import { CSSProperties, ReactNode, useEffect, useId, useRef, useState } from 'react'
import './GlassSurface.css'

/**
 * reactbits.dev의 GlassSurface 포팅 (MIT, https://reactbits.dev/components/glass-surface)
 * - Chromium: backdrop-filter: url(#svg필터)로 배경을 실제로 굴절시키는 liquid glass
 * - Safari/Firefox(iOS WebView 포함): SVG backdrop 필터 미지원이라 blur 기반 프로스트 글래스로 자동 폴백
 */
type GlassSurfaceProps = {
  children?: ReactNode
  width?: number | string
  height?: number | string
  borderRadius?: number
  /** 굴절이 일어나는 가장자리 두께 비율 */
  borderWidth?: number
  /** displacement map 중앙부 밝기(%) */
  brightness?: number
  /** displacement map 중앙부 불투명도 */
  opacity?: number
  /** displacement map 가장자리 블러(px) — 굴절의 부드러움 */
  blur?: number
  /** 결과물 전체에 걸리는 블러(px) */
  displace?: number
  /** 유리면 흰색 프로스트 농도 (0~1) */
  backgroundOpacity?: number
  saturation?: number
  /** 굴절 강도 (음수 = 안쪽으로 굴절) */
  distortionScale?: number
  redOffset?: number
  greenOffset?: number
  blueOffset?: number
  xChannel?: 'R' | 'G' | 'B'
  yChannel?: 'R' | 'G' | 'B'
  mixBlendMode?: CSSProperties['mixBlendMode']
  className?: string
  style?: CSSProperties
}

export default function GlassSurface({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  className = '',
  style = {},
}: GlassSurfaceProps) {
  const uniqueId = useId().replace(/:/g, '-')
  const filterId = `glass-filter-${uniqueId}`
  const redGradId = `red-grad-${uniqueId}`
  const blueGradId = `blue-grad-${uniqueId}`

  const [svgSupported, setSvgSupported] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const feImageRef = useRef<SVGFEImageElement>(null)
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null)
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null)
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null)
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null)

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect()
    const actualWidth = rect?.width || 400
    const actualHeight = rect?.height || 200
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5)

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`
  }

  const updateDisplacementMap = () => {
    feImageRef.current?.setAttribute('href', generateDisplacementMap())
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    updateDisplacementMap()
    ;[
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset },
    ].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute('scale', (distortionScale + offset).toString())
        ref.current.setAttribute('xChannelSelector', xChannel)
        ref.current.setAttribute('yChannelSelector', yChannel)
      }
    })

    gaussianBlurRef.current?.setAttribute('stdDeviation', displace.toString())
  }, [
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode,
  ])

  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateDisplacementMap, 0)
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const supportsSVGFilters = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false
    }

    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    const isFirefox = /Firefox/.test(navigator.userAgent)

    if (isWebkit || isFirefox) {
      return false
    }

    const div = document.createElement('div')
    div.style.backdropFilter = `url(#${filterId})`

    return div.style.backdropFilter !== ''
  }

  useEffect(() => {
    setSvgSupported(supportsSVGFilters())
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  const containerStyle: CSSProperties = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    ['--glass-frost' as string]: backgroundOpacity,
    ['--glass-saturation' as string]: saturation,
    ['--filter-id' as string]: `url(#${filterId})`,
  }

  return (
    <div
      ref={containerRef}
      className={`glass-surface ${svgSupported ? 'glass-surface--svg' : 'glass-surface--fallback'} ${className}`}
      style={containerStyle}>
      <svg className='glass-surface__filter' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <filter id={filterId} colorInterpolationFilters='sRGB' x='0%' y='0%' width='100%' height='100%'>
            <feImage ref={feImageRef} x='0' y='0' width='100%' height='100%' preserveAspectRatio='none' result='map' />

            <feDisplacementMap ref={redChannelRef} in='SourceGraphic' in2='map' result='dispRed' />
            <feColorMatrix
              in='dispRed'
              type='matrix'
              values='1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0'
              result='red'
            />

            <feDisplacementMap ref={greenChannelRef} in='SourceGraphic' in2='map' result='dispGreen' />
            <feColorMatrix
              in='dispGreen'
              type='matrix'
              values='0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0'
              result='green'
            />

            <feDisplacementMap ref={blueChannelRef} in='SourceGraphic' in2='map' result='dispBlue' />
            <feColorMatrix
              in='dispBlue'
              type='matrix'
              values='0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0'
              result='blue'
            />

            <feBlend in='red' in2='green' mode='screen' result='rg' />
            <feBlend in='rg' in2='blue' mode='screen' result='output' />
            <feGaussianBlur ref={gaussianBlurRef} in='output' stdDeviation='0.7' />
          </filter>
        </defs>
      </svg>

      <div className='glass-surface__content'>{children}</div>
    </div>
  )
}
