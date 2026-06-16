import { IconProps } from '@type/icon'

export function MapPinIcon({ size = 24, color = 'currentColor', className, strokeWidth = 2 }: IconProps) {
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
      <path d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' />
      <circle cx='12' cy='10' r='3' />
    </svg>
  )
}

export function PlaceIcon(props: IconProps) {
  return <MapPinIcon {...props} />
}
