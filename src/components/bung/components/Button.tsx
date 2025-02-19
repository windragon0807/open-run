import { ReactNode } from 'react'

export default function Button({
  type = 'button',
  children,
  className,
  onClick,
}: {
  type?: 'button' | 'submit'
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      className={`flex-1 h-40 border border-gray-default rounded-8 flex items-center gap-8 text-sm font-semibold ${className}`}
      onClick={onClick}>
      {children}
    </button>
  )
}
