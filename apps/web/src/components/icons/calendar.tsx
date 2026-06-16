import { IconProps } from '@type/icon'

export function CalendarDaysIcon({ size = 24, color = 'currentColor', className, strokeWidth = 2 }: IconProps) {
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
      <path d='M8 2v4' />
      <path d='M16 2v4' />
      <rect width='18' height='18' x='3' y='4' rx='2' />
      <path d='M3 10h18' />
      <path d='M8 14h.01' />
      <path d='M12 14h.01' />
      <path d='M16 14h.01' />
      <path d='M8 18h.01' />
      <path d='M12 18h.01' />
      <path d='M16 18h.01' />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return <CalendarDaysIcon {...props} />
}
