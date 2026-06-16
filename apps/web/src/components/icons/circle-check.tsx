import { IconProps } from '@type/icon'

export function CircleCheckIcon({ size, color, className }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke={color}
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'>
      <circle cx={12} cy={12} r={10} />
      <path d='m9 12 2 2 4-4' />
    </svg>
  )
}
