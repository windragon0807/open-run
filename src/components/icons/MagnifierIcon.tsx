import { IconProps } from '@type/icon'

export default function MagnifierIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M1.33337 6.33301C1.33337 9.09443 3.57195 11.333 6.33337 11.333C7.40304 11.333 8.39425 10.9971 9.20728 10.4251L13.2664 14.4841L14.2092 13.5413L10.187 9.51911C10.903 8.654 11.3334 7.54376 11.3334 6.33301C11.3334 3.57158 9.0948 1.33301 6.33337 1.33301C3.57195 1.33301 1.33337 3.57158 1.33337 6.33301ZM6.33337 2.66634C4.30833 2.66634 2.66671 4.30796 2.66671 6.33301C2.66671 8.35805 4.30833 9.99967 6.33337 9.99967C8.35842 9.99967 10 8.35805 10 6.33301C10 4.30796 8.35842 2.66634 6.33337 2.66634Z'
        fill={color}
      />
    </svg>
  )
}
