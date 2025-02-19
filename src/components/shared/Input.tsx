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
    <div className='w-full relative'>
      <input
        ref={ref}
        className={clsx(
          'w-full h-40 text-14 px-16 rounded-8 focus:outline-none disabled:bg-gray-default disabled:text-gray-darken',
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
      <span className='text-2xs text-pink font-bold ml-8'>{error}</span>
    </div>
  )
})

Input.displayName = 'Input'

export default Input
