import { ReactNode } from 'react'

export default function NextButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      className='h-59 w-full rounded-8 bg-primary text-base font-bold text-white disabled:bg-gray-default'
      disabled={disabled}
      onClick={onClick}>
      {children}
    </button>
  )
}
