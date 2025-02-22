import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

const NumberInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'inputMode'> & {
    error?: string
    addon?: ReactNode
    setValue?: (value: string) => void
  }
>(({ className, setValue, onChange, addon, error, value, ...rest }, ref) => {
  return (
    <div className='w-full relative'>
      <input
        ref={ref}
        className={clsx(
          'w-full h-40 text-sm px-16 rounded-8 focus:outline-none disabled:bg-gray-default disabled:text-gray-darken',
          error ? 'border-2 border-pink caret-pink' : 'border border-gray-default caret-primary focus:border-primary',
          className,
        )}
        type='number'
        inputMode='numeric'
        pattern='[0-9]*'
        value={value}
        onChange={(event) => {
          const inputValue = event.target.value
          if (/^[0-9]*$/.test(inputValue)) {
            setValue?.(inputValue)
            onChange?.(event)
          }
        }}
        {...rest}
      />
      {addon}
      <span className='text-2xs text-pink font-bold ml-8'>{error}</span>
      <style jsx>{`
        /* 숫자 입력 필드의 화살표 제거 */
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type='number'] {
          -moz-appearance: textfield; /* Firefox에서 화살표 제거 */
        }
      `}</style>
    </div>
  )
})

NumberInput.displayName = 'NumberInput'

export default NumberInput
