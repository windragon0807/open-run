import { forwardRef, useState } from 'react'

import { SingleNumber } from '@/models/register'

type Props = {
  value: SingleNumber
  setValue: (value: SingleNumber) => void
  autoFocus?: boolean
}

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumber({ value, setValue, autoFocus }, ref) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className='relative w-52 h-69 flex justify-center items-center rounded-5 bg-white'>
      <input
        className='appearance-none opacity-0 absolute top-0 left-0 bottom-0 right-0'
        ref={ref}
        type='number'
        value={value}
        onChange={(e) => {
          setValue(Number(e.target.value.at(-1) || 0) as SingleNumber)
        }}
        onFocus={() => {
          setIsFocused(true)
          /* input 포커스 받을 시, 입력되는 요소가 키보드 위에 올라오도록 스크롤 조정 */
          window.scrollTo({ top: 150, behavior: 'smooth' })
        }}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
      />
      <span className={`text-4xl font-bold ${isFocused ? 'text-secondary' : 'text-primary'}`}>{value}</span>
    </div>
  )
})

export default InputNumber
