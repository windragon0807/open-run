import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    error?: string
    addon?: ReactNode
    setValue?: (value: string) => void
  }
>(({ className, setValue, onChange, addon, error, ...rest }, ref) => {
  return (
    <div className='relative w-full'>
      <input
        ref={ref}
        className={clsx(
          'h-40 w-full rounded-8 px-16 text-14 focus:outline-none disabled:bg-gray-default disabled:text-gray-darken',
          error ? 'border-2 border-pink caret-pink' : 'border border-gray-default caret-primary focus:border-primary',
          className,
        )}
        onChange={(event) => {
          setValue?.(event.target.value)
          onChange?.(event)
        }}
        {...rest}
      />
      {addon}
      <span className='ml-8 text-2xs font-bold text-pink'>{error}</span>
    </div>
  )
})

Input.displayName = 'Input'

export default Input
