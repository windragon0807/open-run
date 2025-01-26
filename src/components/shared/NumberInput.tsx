import { InputHTMLAttributes, ReactNode } from 'react'

export default function NumberInput({
  className,
  setValue,
  onChange,
  addon,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'inputMode'> & {
  setValue?: (value: string) => void
  addon?: ReactNode
}) {
  return (
    <div className='w-full relative'>
      <input
        type='number'
        inputMode='numeric'
        className={`w-full h-40 text-14 border border-gray-default px-16 rounded-8 caret-primary focus:outline-none focus:border-primary disabled:bg-gray-default disabled:text-gray-darken ${className}`}
        onChange={(event) => {
          setValue?.(event.target.value)
          onChange?.(event)
        }}
        {...rest}
      />
      {addon}
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
}
