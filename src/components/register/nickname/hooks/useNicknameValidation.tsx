import checkExistNickname from '@/apis/nickname/checkExistNickname/api'
import { useCallback, useState } from 'react'

export const useNicknameValidation = () => {
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const NICKNAME_EXIST_CHK_DELAY = 500

  const handleNicknameChange = useCallback(
    async (nickname: string, setIsValid: (isValid: boolean | null) => void) => {
      /** 닉네임이 두 글자 이상일 때만 유효성 검사 실시 */
      if (nickname.length < 2) {
        return
      }

      /** 닉네임이 변경된 후 {NICKNAME_EXIST_CHK_DELAY}ms 뒤 중복 확인 api를 호출하도록 디바운싱 처리 */
      clearTimeout(typingTimeout as NodeJS.Timeout)
      const timeout = setTimeout(async () => {
        try {
          /** 중복 확인 API 호출 이후 data 변경 */
          const response = await checkExistNickname({ nickname })
          console.log('response', response)
        } catch (error) {
          console.error(error)
          throw error
        }
      }, NICKNAME_EXIST_CHK_DELAY)

      setTypingTimeout(timeout)
    },
    [typingTimeout],
  )

  return { handleNicknameChange }
}
