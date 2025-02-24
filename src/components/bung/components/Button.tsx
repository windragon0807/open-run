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
      className={`flex h-40 flex-1 items-center gap-8 rounded-8 border border-gray-default text-sm font-semibold ${className}`}
      onClick={onClick}>
      {children}
    </button>
  )
}
