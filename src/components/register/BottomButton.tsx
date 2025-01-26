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
      className='w-full h-59 bg-primary text-white text-base font-bold rounded-8 disabled:bg-gray-default'
      disabled={disabled}
      onClick={onClick}>
      {children}
    </button>
  )
}
