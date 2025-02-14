import { IconProps } from '@type/icon'

export default function RandomIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M21.2424 8.00022L21.2427 8.00001L19.8284 6.58579L19.8282 6.58601L17.7071 4.46484L16.2928 5.87906L17.4136 6.99978H13.5L7.5 14.9998H3V16.9998H8.5L14.5 8.99978H17.4144L16.2929 10.1213L17.7071 11.5355L19.8282 9.41443L19.8284 9.41459L21.2426 8.00038L21.2424 8.00022ZM7.5 8.99978L8.8125 10.7498L10.0625 9.08312L8.8 7.39979L8.5 6.99978H8H3V8.99978H7.5ZM13.2 16.5998L11.9375 14.9165L13.1875 13.2498L14.5 14.9998H17.4135L16.2928 13.8791L17.707 12.4649L19.8281 14.586L19.8284 14.5857L21.2426 16L21.2424 16.0002L21.2426 16.0004L19.8284 17.4146L19.8281 17.4144L17.7071 19.5355L16.2929 18.1213L17.4143 16.9998H14H13.5L13.2 16.5998Z'
        fill={color}
      />
    </svg>
  )
}
