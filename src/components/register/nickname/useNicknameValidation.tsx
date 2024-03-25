import axios from '@/apis/axios'
import { useCallback, useState } from 'react'

export const useNicknameValidation = () => {
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const NICKNAME_EXIST_CHK_DELAY = 500

  /**
   * 닉네임 중복 검사 api 호출
   * TODO: apis 폴더로 이동 예정
   */
  const checkExistNickname = async (nickname: string) => {
    try {
      /** API 호출 위치 */
      console.log('checkExistNickname', nickname)
    } catch (error) {
      console.error(error)
    }
  }

  const handleNicknameChange = useCallback(
    async (nickname: string, setIsValid: (isValid: boolean | null) => void) => {
      /** 닉네임이 변경된 후 NICKNAME_EXIST_CHK_DELAYms 뒤 중복 확인 api를 호출하도록 디바운싱 처리 */
      clearTimeout(typingTimeout as NodeJS.Timeout)

      const timeout = setTimeout(() => {
        /** 중복 확인 API 호출 이후 data 변경 */
        checkExistNickname(nickname).then((data) => {
          // setIsValid(data)
        })
      }, NICKNAME_EXIST_CHK_DELAY)

      setTypingTimeout(timeout)
    },
    [typingTimeout],
  )

  return { handleNicknameChange }
}
