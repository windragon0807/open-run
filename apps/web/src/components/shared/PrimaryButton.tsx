import clsx from 'clsx'
import { ReactNode } from 'react'

export default function PrimaryButton({
  type = 'button',
  variant = 'primary',
  className,
  children,
  disabled,
  onClick,
}: {
  type?: 'button' | 'submit'
  variant?: 'primary' | 'neutral'
  className?: string
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      className={clsx(
        'active:scale-98 flex h-56 w-full items-center justify-center rounded-8 active-press-duration disabled:bg-gray disabled:text-gray-lighten',
        variant === 'primary' && 'bg-primary text-white active:bg-primary-darken',
        variant === 'neutral' && 'bg-gray-soft text-black-darken active:bg-gray/80',
        className,
      )}
      disabled={disabled}
      onClick={onClick}>
      <span className='text-16 font-bold'>{children}</span>
    </button>
  )
}
