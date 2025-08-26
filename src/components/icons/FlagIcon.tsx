import { IconProps } from '@type/icon'

export default function FlagIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16'>
      <path
        fill={color}
        d='M1.53552 3.97656C1.85603 3.94882 2.14329 4.15343 2.2318 4.4502L2.25719 4.58301L3.12829 14.5449L1.80016 14.6611L0.92907 4.69922C0.901149 4.37852 1.10479 4.09045 1.40173 4.00195L1.53552 3.97656ZM13.0472 6.98242L15.3334 10.1328L10.1908 11.416L7.04723 10.249L4.00036 11.999L3.33337 4.53223L6.47594 2.66602L9.6195 3.94922L14.7621 2.66602L13.0472 6.98242Z'
      />
    </svg>
  )
}
