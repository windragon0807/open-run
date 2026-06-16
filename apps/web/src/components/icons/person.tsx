import { IconProps } from '@type/icon'

export function OutlinedPersonIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24'>
      {/* 머리는 몸통 아치(폭 16)와 비율을 맞춘 비채움 원 — 기존 4x5 채움 캡슐은 과하게 작았다 */}
      <circle cx='12' cy='6.5' r='3.5' fill='none' stroke={color} strokeWidth='2' />
      <path
        fill={color}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4 20C4 19.6613 4.02104 19.3276 4.06189 19H6.08296H7H17.917C17.441 16.1623 14.973 14 12 14C9.77915 14 7.84012 15.2066 6.80269 17H4.58152C5.76829 14.0682 8.64262 12 12 12C16.0796 12 19.446 15.0537 19.9381 19C19.979 19.3276 20 19.6613 20 20V21H18H6H4V20Z'
      />
    </svg>
  )
}

export function FilledPersonIcon(props: IconProps) {
  return <UserIcon {...props} />
}

export function UserIcon({ size = 24, color = 'currentColor', className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      focusable='false'
      height={size}
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      viewBox='0 0 24 24'
      width={size}
    >
      <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </svg>
  )
}
