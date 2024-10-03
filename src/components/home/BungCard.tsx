'use client'

import { useEffect, useState } from 'react'
import { ko } from 'date-fns/locale'
import { format, differenceInSeconds } from 'date-fns'

import Spacing from '@shared/Spacing'
import RunnerIcon from '@icons/RunnerIcon'
import PlaceIcon from '@icons/PlaceIcon'
import CrownIcon from '@icons/CrownIcon'
import CalendarIcon from '@icons/CalendarIcon'

export default function BungCard({
  place,
  time,
  distance,
  pace,
  isBungMaster,
}: {
  place: string
  time: Date
  distance: number
  pace: string
  isBungMaster: boolean
}) {
  // 남은 시간을 상태로 관리
  const [remainingTime, setRemainingTime] = useState(differenceInSeconds(time, new Date()))

  useEffect(() => {
    // 타이머를 1초마다 업데이트
    const timerId = setInterval(() => {
      const secondsLeft = differenceInSeconds(time, new Date())
      if (secondsLeft <= 0) {
        clearInterval(timerId)
      }
      setRemainingTime(secondsLeft)
    }, 1000)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timerId)
  }, [time])

  // 남은 시간을 일, 시, 분, 초로 변환
  const days = Math.floor(remainingTime / (3600 * 24))
  const hours = Math.floor((remainingTime % (3600 * 24)) / 3600)
  const minutes = Math.floor((remainingTime % 3600) / 60)
  const seconds = remainingTime % 60

  const formattedTime = `${String(days).padStart(2, '0')} : ${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`

  const formattedDate = format(time, 'M월 d일 (E) a h:mm', { locale: ko })

  return (
    <article
      className='relative w-full max-w-[500px] mx-auto bg-black h-184 rounded-8 p-16 text-white bg-cover bg-center'
      style={{ backgroundImage: "url('/temp/bg_bung.png')" }}>
      {isBungMaster ? <CrownIcon className='absolute top-16 right-16' /> : null}
      <span className='text-[16px] italic font-black leading-[24px] tracking-[-0.32px]'>{formattedTime}</span>
      <Spacing size={8} />
      <div className='flex gap-6 items-center'>
        <PlaceIcon />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>{place}</span>
      </div>
      <Spacing size={2} />
      <div className='flex gap-6 items-center'>
        <CalendarIcon />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>{formattedDate}</span>
      </div>
      <Spacing size={2} />
      <div className='flex gap-6 items-center'>
        <RunnerIcon />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>
          {distance}km {pace}
        </span>
      </div>
    </article>
  )
}
