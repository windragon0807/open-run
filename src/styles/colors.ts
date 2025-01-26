export const colors = {
  primary: '#4A5CEF',
  secondary: '#E0FB60',

  white: '#fff',
  black: {
    default: '#333',
    transparent: 'rgba(34, 34, 34, 0.60)',
    darken: '#222',
    darkest: '#000',
  },
  gray: {
    lighten: '#F8F9FA',
    default: '#DEE2E6',
    darken: '#ADB5BD',
    darkest: '#868E96',
  },
  blue: {
    default: '#4A5CEF',
    transparent: 'rgba(74, 92, 239, 0.10)',
  },
  pink: {
    default: '#F06595',
    transparent: 'rgba(240, 101, 149, 0.10)',
  },
  fluorescent: '#E0FB60',
  red: '#FF0000',

  kakao: '#FEE500',
  naver: '#06C755',
} as const

export const palette = {
  ...colors,

  focusedBlue: 'rgba(74, 92, 239, 0.10)',
}
