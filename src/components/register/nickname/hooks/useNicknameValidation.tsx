import { useCallback, useState } from 'react'

import checkExistNickname from '@apis/auth/checkExistNickname/api'
import { NicknameValidState } from '../types'

const NICKNAME_EXIST_CHK_DELAY = 500

export const useNicknameValidation = () => {
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleNicknameChange = useCallback(
    async (nickname: string, setIsValid: (isValid: NicknameValidState) => void) => {
      /** 닉네임이 두 글자 이상일 때만 유효성 검사 실시 */
      if (nickname.length < 2) {
        setIsValid('default')
        return
      }

      /** 두 글자 이상이지만 한글 초성만 입력된 경우, 유효성 실패로 인정 */
      const isOnlyChosung = /^[ㄱ-ㅎ]+$/
      if (isOnlyChosung.test(nickname)) {
        setIsValid('consonant')
        return
      }

      /** 닉네임이 변경된 후 {NICKNAME_EXIST_CHK_DELAY}ms 뒤 중복 확인 api를 호출하도록 디바운싱 처리 */
      clearTimeout(typingTimeout as NodeJS.Timeout)
      const timeout = setTimeout(async () => {
        try {
          /** 중복 확인 API 호출 이후 data 변경 */
          const response = await checkExistNickname({ nickname })
          setIsValid(response.data === true ? 'overlap' : 'pass')
        } catch (error) {
          console.error(error)
        }
      }, NICKNAME_EXIST_CHK_DELAY)

      setTypingTimeout(timeout)
    },
    [typingTimeout],
  )

  return { handleNicknameChange }
}
