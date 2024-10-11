import { InputHTMLAttributes } from 'react'

export default function NumberInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'inputMode'>) {
  return (
    <>
      <input type='number' inputMode='numeric' {...props} />
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
    </>
  )
}
