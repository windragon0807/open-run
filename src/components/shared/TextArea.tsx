import { InputHTMLAttributes } from 'react'

export default function TextArea({
  className,
  setValue,
  onChange,
  ...rest
}: InputHTMLAttributes<HTMLTextAreaElement> & {
  setValue?: (value: string) => void
}) {
  return (
    <div className='w-full relative'>
      <textarea
        className={`w-full h-40 text-14 border border-gray-default px-16 rounded-8 caret-primary focus:outline-none resize-none dark:bg-black-darkest dark:text-white dark:placeholder-black:default focus:border-primary dark:focus:border-gray-default ${className}`}
        onChange={(event) => {
          setValue?.(event.target.value)
          onChange?.(event)
        }}
        {...rest}
      />
    </div>
  )
}
