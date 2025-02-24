'use client'

import clsx from 'clsx'
import Spacing from '@shared/Spacing'
import RunnerIcon from '@icons/RunnerIcon'
import PlaceIcon from '@icons/PlaceIcon'
import CrownIcon from '@icons/CrownIcon'
import CalendarIcon from '@icons/CalendarIcon'
import useTimer from '@hooks/useTimer'
import { currentDate, formatDate, timerFormat } from '@utils/time'
import { colors } from '@styles/colors'

export default function BungCard({
  backgroundImageUrl,
  time,
  title,
  place,
  distance,
  pace,
  isBungOwner,
}: {
  backgroundImageUrl: string
  time: Date
  title: string
  place: string
  distance: number
  pace: string
  isBungOwner: boolean
}) {
  const { days, hours, minutes, seconds } = useTimer(time)
  const formattedTime = timerFormat({ days, hours, minutes, seconds })
  const formattedDate = formatDate(time, 'M월 d일 (E) a h:mm')
  const 벙이진행중인가 = time < currentDate()

  return (
    <article
      className={clsx(
        'relative mx-auto h-184 w-full max-w-[500px] rounded-8 bg-cover bg-center p-16 text-white shadow-lg',
        벙이진행중인가 && 'border-3 border-secondary',
      )}
      style={{
        backgroundImage: `${벙이진행중인가 ? 'linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(224, 251, 96, 0.50) 100%), ' : ''}url(${backgroundImageUrl})`,
      }}>
      {isBungOwner ? <CrownIcon className='absolute right-16 top-16' size={24} color={colors.white} /> : null}
      <span
        className={clsx(
          'text-[16px] font-black italic leading-[24px] tracking-[-0.32px]',
          벙이진행중인가 && 'font-jost font-black text-secondary',
        )}>
        {벙이진행중인가 ? 'Run Started!' : formattedTime}
      </span>
      <Spacing size={8} />
      <p className='truncate text-base font-bold text-white'>{title}</p>
      <Spacing size={8} />
      <div className='flex items-center gap-6'>
        <PlaceIcon size={16} color={colors.white} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>{place}</span>
      </div>
      <Spacing size={2} />
      <div className='flex items-center gap-6'>
        <CalendarIcon size={16} color={colors.white} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>{formattedDate}</span>
      </div>
      <Spacing size={2} />
      <div className='flex items-center gap-6'>
        <RunnerIcon size={16} color={colors.white} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>
          {distance}km {pace}
        </span>
      </div>
    </article>
  )
}
