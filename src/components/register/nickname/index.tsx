import InputText from './InputText'
import { useNicknameValidation } from './hooks/useNicknameValidation'
import { NicknameValidState } from './types'

export default function Nickname({
  nickname,
  setNickname,
  isValid,
  setIsValid,
}: {
  nickname: string
  setNickname: (nickname: string) => void
  isValid: NicknameValidState
  setIsValid: (isValid: NicknameValidState) => void
}) {
  const { handleNicknameChange } = useNicknameValidation()

  return (
    <section className='flex h-full w-full flex-col items-center bg-gray-lighten pt-124 app:pt-174'>
      <p className='text-center text-28'>닉네임을 정해주세요</p>
      <p className='mb-40 text-center text-28 font-bold text-primary'>어떻게 불러드릴까요?</p>
      <InputText
        value={nickname}
        isValid={isValid}
        onChange={(nickname) => {
          handleNicknameChange(nickname, setIsValid)
          setNickname(nickname)
        }}
      />
    </section>
  )
}
