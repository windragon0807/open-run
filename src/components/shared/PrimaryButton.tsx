import { ReactNode } from 'react'

export default function PrimaryButton({
  className,
  children,
  disabled,
  onClick,
}: {
  className?: string
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      className={`w-full h-56 rounded-8 bg-primary flex items-center justify-center disabled:bg-gray-default disabled:text-gray-lighten ${className}`}
      disabled={disabled}
      onClick={onClick}>
      <span className='text-base font-bold text-white leading-[24px] tracking-[-0.32px]'>{children}</span>
    </button>
  )
}
