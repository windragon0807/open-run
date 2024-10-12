import { InputHTMLAttributes, ReactNode } from 'react'

export default function Input({
  className,
  setValue,
  onChange,
  addon,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  setValue?: (value: string) => void
  addon?: ReactNode
}) {
  return (
    <div className='w-full relative'>
      <input
        className={`w-full h-40 text-14 border border-gray px-16 rounded-8 caret-primary focus:outline-none dark:bg-black-darkest dark:text-white dark:placeholder-black focus:border-primary dark:focus:border-gray ${className}`}
        onChange={(event) => {
          setValue?.(event.target.value)
          onChange?.(event)
        }}
        {...rest}
      />
      {addon}
    </div>
  )
}
