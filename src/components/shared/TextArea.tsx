import clsx from 'clsx'
import { forwardRef, InputHTMLAttributes } from 'react'

const TextArea = forwardRef<
  HTMLTextAreaElement,
  InputHTMLAttributes<HTMLTextAreaElement> & {
    error?: string
    setValue?: (value: string) => void
  }
>(({ className, error, setValue, onChange, ...rest }, ref) => {
  return (
    <div className='relative w-full'>
      <textarea
        ref={ref}
        className={clsx(
          'h-40 w-full resize-none rounded-8 border border-gray-default px-16 text-14 caret-primary focus:border-primary focus:outline-none',
          error ? 'border-2 border-pink caret-pink' : 'border border-gray-default caret-primary focus:border-primary',
          className,
        )}
        onChange={(event) => {
          setValue?.(event.target.value)
          onChange?.(event)
        }}
        {...rest}
      />
    </div>
  )
})

TextArea.displayName = 'TextArea'

export default TextArea
