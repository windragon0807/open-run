'use client'

import TypingText from '@components/shared/TypingText'
import useAppInsetSize from '@hooks/useAppInsetSize'
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
  const topPadding = useAppInsetSize('top', 124)

  return (
    <section className='flex h-full w-full flex-col items-center bg-gray-lighten pt-124' style={{ paddingTop: topPadding }}>
      <p className='text-center text-28'>닉네임을 정해주세요</p>
      <TypingText
        text='어떻게 불러드릴까요?'
        wrapper='p'
        className='mb-40 text-center text-28 font-bold text-primary'
      />
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
