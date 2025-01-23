import { ReactNode } from 'react'

export default function Button({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      className={`flex-1 h-40 border border-gray rounded-8 flex items-center gap-8 text-sm font-semibold ${className}`}
      onClick={onClick}>
      {children}
    </button>
  )
}
