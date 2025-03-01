import { IconProps } from '@type/icon'

export default function OpenrunIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <path
        d='M14.7857 20H0L1.09524 14.6667H14.7857C16.2979 14.6667 17.5238 13.4728 17.5238 12C17.5238 10.5272 16.2979 9.33333 14.7857 9.33333H9.30952C7.79732 9.33333 6.57143 10.5272 6.57143 12C6.57143 12.1826 6.59028 12.361 6.6262 12.5333H1.1132C1.10129 12.3571 1.09524 12.1792 1.09524 12C1.09524 7.58172 4.7729 4 9.30952 4H14.7857C19.3223 4 23 7.58172 23 12C23 16.4183 19.3223 20 14.7857 20Z'
        fill={color}
      />
    </svg>
  )
}
