import Spacing from '@shared/Spacing'
import { NicknameValidState } from './types'
import InputText from './InputText'
import { useNicknameValidation } from './hooks/useNicknameValidation'

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
    <section className='w-full h-full bg-gray-lighten flex flex-col items-center'>
      <Spacing size={60 + 64} />
      <p className='text-4xl text-center'>닉네임을 정해주세요</p>
      <p className='text-4xl text-primary font-bold text-center'>어떻게 불러드릴까요?</p>
      <Spacing size={40} />
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
