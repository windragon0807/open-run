'use client'

import { ko } from 'date-fns/locale'
import { format } from 'date-fns'

import Spacing from '@shared/Spacing'
import RunnerIcon from '@icons/RunnerIcon'
import PlaceIcon from '@icons/PlaceIcon'
import CrownIcon from '@icons/CrownIcon'
import CalendarIcon from '@icons/CalendarIcon'
import useTimer from '@hooks/useTimer'
import { padStart } from '@utils/string'

export default function BungCard({
  place,
  time,
  distance,
  pace,
  isBungOwner,
  title,
}: {
  place: string
  time: Date
  distance: number
  pace: string
  isBungOwner: boolean
  title: string
}) {
  const { days, hours, minutes, seconds } = useTimer(time)
  const formattedTime = `${padStart(days)} : ${padStart(hours)} : ${padStart(minutes)} : ${padStart(seconds)}`
  const formattedDate = format(time, 'M월 d일 (E) a h:mm', { locale: ko })

  return (
    <article
      className='relative w-full max-w-[500px] mx-auto bg-black h-184 rounded-8 p-16 text-white bg-cover bg-center'
      style={{ backgroundImage: "url('/temp/img_thumbnail_1.png')" }}>
      {isBungOwner ? <CrownIcon className='absolute top-16 right-16' /> : null}
      <span className='text-[16px] italic font-black leading-[24px] tracking-[-0.32px]'>{formattedTime}</span>
      <Spacing size={8} />
      <p className='text-base font-bold text-white truncate'>{title}</p>
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
