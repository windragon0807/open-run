import { IconProps } from '@type/icon'

export default function PlusIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.66669 2.66699V7.33366H13.3334V8.66699H8.66669V13.3337H7.33335L7.33335 12.0003L7.33335 8.66699L7.33335 7.33366V4.66699V2.66699H8.66669ZM5.33335 7.33366H2.66669V8.66699H5.33335V7.33366Z'
        fill={color}
      />
    </svg>
  )
}
