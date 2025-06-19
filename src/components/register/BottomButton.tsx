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
      className='disabled:bg-gray h-59 w-full rounded-8 bg-primary text-16 font-bold text-white'
      disabled={disabled}
      onClick={onClick}>
      {children}
    </button>
  )
}
