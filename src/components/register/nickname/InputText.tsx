import Spacing from '@shared/Spacing'
import { NicknameValidState } from './types'

export default function InputText({
  value,
  maxLength = 10,
  isValid,
  onChange,
}: {
  value: string
  maxLength?: number
  isValid: NicknameValidState
  onChange: (value: string) => void
}) {
  return (
    <article>
      <div className='relative inline-block'>
        <input
          className={`w-300 h-50 bg-inherit pl-10 outline-none border-b-2 caret-primary
            ${isValid === 'default' ? 'border-gray-default' : ''}
            ${isValid === 'pass' ? 'border-primary' : ''}
            ${isValid === 'overlap' || isValid === 'consonant' ? 'border-red' : ''}
          `}
          type='text'
          placeholder='2-10자 이내로 입력해 주세요'
          value={value}
          onChange={(e) => {
            /* 한글, 영어, 숫자 입력 가능 */
            const regex = /^[A-Za-z0-9\u3131-\uD79D]*$/
            if (regex.test(e.target.value) && e.target.value.length <= maxLength) {
              onChange(e.target.value)
            }
          }}
        />
        <span className='absolute right-10 text-gray-default top-[50%] -translate-y-1/2'>
          {value.length}/{maxLength}
        </span>
      </div>
      <Spacing size={10} />
      {isValid === 'pass' ? <span className='ml-10 text-sm text-primary'>사용 가능한 닉네임이에요</span> : null}
      {isValid === 'overlap' ? <span className='ml-10 text-sm text-red'>이미 사용 중인 닉네임이에요</span> : null}
      {isValid === 'consonant' ? <span className='ml-10 text-sm text-red'>올바르지 않은 형식이에요</span> : null}
    </article>
  )
}
