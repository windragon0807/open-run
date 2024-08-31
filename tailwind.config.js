const px0_10 = { ...Array.from(Array(11)).map((_, i) => `${i}px`) }
const px0_30 = { ...Array.from(Array(31)).map((_, i) => `${i}px`) }
const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}px`) }
const px0_200 = { ...Array.from(Array(201)).map((_, i) => `${i}px`) }
const px0_500 = { ...Array.from(Array(501)).map((_, i) => `${i}px`) }

/** @type {import('tailwindcss').Config} */
module.exports = {
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
      xs: ['0.8125rem', { lineHeight: 1.538 }], // 13px / 20px
      sm: ['0.875rem', { lineHeight: 1.5 }], // 14px / 21px
      base: ['1rem', { lineHeight: 1.5 }], // 16px / 24px
      lg: ['1.125rem', { lineHeight: 1.5 }], // 18px / 27px
      xl: ['1.375rem', { lineHeight: 1.545 }], // 22px / 34px
      '2xl': ['1.5rem', { lineHeight: 1.5 }], // 24px / 36px
      '3xl': ['1.625rem', { lineHeight: 1.385 }], // 26px / 36px
      '4xl': ['1.75rem', { lineHeight: 1.5 }], // 28px / 42px
      '5xl': ['2rem', { lineHeight: 1.5 }], // 32px / 48px
      '6xl': ['2.625rem', { lineHeight: 1.571 }], // 42px / 66px
      '7xl': ['3.5rem', { lineHeight: 1.428 }], // 56px / 80px
      '8xl': ['4rem', { lineHeight: 1.5 }], // 64px / 96px
    },
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,

      white: 'var(--white)',
      black: 'var(--black)',
      'black-darken': 'var(--black-darken)',
      'black-darkest': 'var(--black-darkest)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      red: 'var(--red)',
      gray: 'var(--gray)',
      'gray-lighten': 'var(--gray-lighten)',
      kakao: 'var(--kakao)',
      naver: 'var(--naver)',
    }),
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      backgroundImage: {
        // 회원가입, 로그인 페이지 백그라운드 그라디언트
        'gradient-primary-white': 'linear-gradient(to bottom, #4A5CEF 50%, #FFF)',
        'gradient-black': 'linear-gradient(180deg, rgba(224, 251, 96, 0.10) 0%, rgba(74, 92, 239, 0.00) 100%)',
        'gradient-main': 'url("/images/bg_home_gradient.png")',
      },
      backgroundColor: {
        'black-lighten': 'rgba(34, 34, 34, 0.60)',
      },
      borderWidth: px0_10,
      width: px0_500,
      height: px0_500,
      padding: px0_100,
      margin: px0_100,
      spacing: px0_200,
      borderRadius: px0_30,
      maxWidth: {
        tablet: '768px',
      },
      boxShadow: {
        'custom-white': '0px 0px 16px 0px rgba(74, 92, 239, 0.20)',
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
  plugins: [],
}
