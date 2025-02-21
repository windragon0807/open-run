import type { Config } from 'tailwindcss'
import { colors } from './src/styles/colors'

const createPxRange = (max: number) => Object.fromEntries(Array.from(Array(max + 1)).map((_, i) => [i, `${i}px`]))

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '360px', // min-w-[360px]
      sm: '576px',
      md: '769px', // Tablet 769px - 1366px (max-w-[768px] 고정에 중앙정렬로 여백만 확대)
      lg: '1024px',
      xl: '1280px',
      '2xl': '1367px', // Desktop 시작 1367px
      '3xl': '1536px',
      '4xl': '1920px',
    },
    fontSize: {
      '3xs': ['0.625rem', { lineHeight: '1.538' }], // 10px
      '2xs': ['0.75rem', { lineHeight: '1.538' }], // 12px
      xs: ['0.8125rem', { lineHeight: '1.538' }], // 13px
      sm: ['0.875rem', { lineHeight: '1.5' }], // 14px
      base: ['1rem', { lineHeight: '1.5' }], // 16px
      lg: ['1.125rem', { lineHeight: '1.5' }], // 18px
      xl: ['1.375rem', { lineHeight: '1.545' }], // 22px
      '2xl': ['1.5rem', { lineHeight: '1.5' }], // 24px
      '3xl': ['1.625rem', { lineHeight: '1.385' }], // 26px
      '4xl': ['1.75rem', { lineHeight: '1.5' }], // 28px
      '5xl': ['2rem', { lineHeight: '1.5' }], // 32px
      '6xl': ['2.625rem', { lineHeight: '1.571' }], // 42px
      '7xl': ['3.5rem', { lineHeight: '1.428' }], // 56px
      '8xl': ['4rem', { lineHeight: '1.5' }], // 64px
    },
    colors: ({ colors: defaults }) => ({
      inherit: defaults.inherit,
      current: defaults.current,
      transparent: defaults.transparent,
      ...colors,
    }),
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        jost: ['var(--font-jost)'],
      },
      borderWidth: createPxRange(10),
      width: createPxRange(500),
      height: createPxRange(500),
      padding: createPxRange(100),
      margin: createPxRange(100),
      spacing: createPxRange(200),
      borderRadius: createPxRange(30),
      fontSize: createPxRange(30),
      lineHeight: createPxRange(50),
      maxWidth: {
        tablet: '768px',
      },
      backgroundImage: {
        'gradient-primary-white': 'linear-gradient(to bottom, #4A5CEF 50%, #FFF)',
        'gradient-white-secondary-primary':
          'linear-gradient(146deg, rgba(255, 255, 255, 0.20) 41.23%, rgba(224, 251, 96, 0.20) 65.21%, rgba(74, 92, 239, 0.20) 81.2%)',
        'gradient-transparent-secondary':
          'linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(224, 251, 96, 0.80) 100%)',
      },
      boxShadow: {
        'floating-primary': '0px 0px 16px 0px rgba(74, 92, 239, 0.20)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 7s linear infinite',
      },
    },
  },
}

export default config
