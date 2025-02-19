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
    <div className='w-full relative'>
      <textarea
        ref={ref}
        className={clsx(
          'w-full h-40 text-14 border border-gray-default px-16 rounded-8 caret-primary focus:outline-none resize-none focus:border-primary',
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
