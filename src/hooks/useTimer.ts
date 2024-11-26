import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

export default function useTimer(targetTime: Date) {
  // 남은 시간을 상태로 관리
  const [remainingTime, setRemainingTime] = useState(differenceInSeconds(targetTime, new Date()))

  useEffect(() => {
    // 타이머를 1초마다 업데이트
    const timerId = setInterval(() => {
      const secondsLeft = differenceInSeconds(targetTime, new Date())
      if (secondsLeft <= 0) {
        clearInterval(timerId)
      }
      setRemainingTime(secondsLeft)
    }, 1000)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timerId)
  }, [targetTime])

  // 남은 시간을 일, 시, 분, 초로 변환
  const days = Math.floor(remainingTime / (3600 * 24))
  const hours = Math.floor((remainingTime % (3600 * 24)) / 3600)
  const minutes = Math.floor((remainingTime % 3600) / 60)
  const seconds = remainingTime % 60

  return { days, hours, minutes, seconds }
}
