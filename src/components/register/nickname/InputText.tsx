import Spacing from '../../shared/Spacing'

type Props = {
  value: string
  maxLength?: number
  isValid: boolean | null
  onChange: (value: string) => void
}

export default function InputText({ value, maxLength = 15, isValid, onChange }: Props) {
  return (
    <>
      <div className='relative inline-block'>
        <input
          className={`w-300 h-60 bg-white pl-20 rounded-30 outline-none border-4 caret-secondary
            ${isValid === null ? 'border-gray' : ''}
            ${isValid === true ? 'border-secondary' : ''}
            ${isValid === false ? 'border-red' : ''}
          `}
          type='text'
          placeholder='닉네임을 입력해주세요'
          value={value}
          onChange={(e) => {
            /* 한글, 영어, 숫자 입력 가능 */
            const regex = /^[A-Za-z0-9\u3131-\uD79D]*$/
            if (regex.test(e.target.value) && e.target.value.length <= maxLength) {
              onChange(e.target.value)
            }
          }}
        />
        <span className='absolute right-20 text-gray top-[50%] -translate-y-1/2'>
          {value.length}/{maxLength}
        </span>
      </div>
      <Spacing size={10} />
      {isValid === true ? <span className='text-sm text-white'>사용 가능한 닉네임이에요</span> : null}
      {isValid === false ? <span className='text-sm text-red'>이미 사용되고 있는 닉네임이에요</span> : null}
    </>
  )
}
