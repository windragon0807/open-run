'use client'

import Spacing from '@shared/Spacing'
import RunnerIcon from '@icons/RunnerIcon'
import PlaceIcon from '@icons/PlaceIcon'
import CrownIcon from '@icons/CrownIcon'
import CalendarIcon from '@icons/CalendarIcon'
import useTimer from '@hooks/useTimer'
import { formatDate, timerFormat } from '@utils/time'
import { colors } from '@styles/colors'

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
  const formattedTime = timerFormat({ days, hours, minutes, seconds })
  const formattedDate = formatDate(time, 'M월 d일 (E) a h:mm')

  return (
    <article
      className='relative w-full max-w-[500px] mx-auto bg-black-default h-184 rounded-8 p-16 text-white bg-cover bg-center'
      style={{ backgroundImage: "url('/images/bung/img_thumbnail_1.png')" }}>
      {isBungOwner ? <CrownIcon className='absolute top-16 right-16' size={24} color={colors.white} /> : null}
      <span className='text-[16px] italic font-black leading-[24px] tracking-[-0.32px]'>{formattedTime}</span>
      <Spacing size={8} />
      <p className='text-base font-bold text-white truncate'>{title}</p>
      <Spacing size={8} />
      <div className='flex gap-6 items-center'>
        <PlaceIcon size={16} color={colors.white} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>{place}</span>
      </div>
      <Spacing size={2} />
      <div className='flex gap-6 items-center'>
        <CalendarIcon size={16} color={colors.white} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>{formattedDate}</span>
      </div>
      <Spacing size={2} />
      <div className='flex gap-6 items-center'>
        <RunnerIcon size={16} color={colors.white} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>
          {distance}km {pace}
        </span>
      </div>
    </article>
  )
}
