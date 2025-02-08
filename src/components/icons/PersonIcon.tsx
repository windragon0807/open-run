import { IconProps } from '@type/icon'

export default function PersonIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <rect
        x='1'
        y='-1'
        width='2'
        height='2.66667'
        rx='1'
        transform='matrix(1 0 0 -1 6 4.66699)'
        fill={color}
        stroke={color}
        strokeWidth='2'
      />
      <path
        d='M7.99996 9C5.71888 9 3.84946 10.7625 3.67926 13H12.3207C12.1505 10.7625 10.281 9 7.99996 9Z'
        fill={color}
        stroke={color}
        strokeWidth='2'
      />
    </svg>
  )
}
