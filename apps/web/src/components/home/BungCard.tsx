'use client'

import clsx from 'clsx'
import Image from 'next/image'
import RunStartedText from '@shared/RunStartedText'
import Spacing from '@shared/Spacing'
import { CalendarIcon } from '@icons/calendar'
import { BoxedCrownIcon } from '@icons/crown'
import { PlaceIcon } from '@icons/place'
import { RunnerIcon } from '@icons/runner'
import useTimer from '@hooks/useTimer'
import { formatDate, timerFormat } from '@utils/time'
import { colors } from '@styles/colors'

const CARD_IMAGE_SIZES = '(max-width: 532px) calc(100vw - 32px), 500px'

export default function BungCard({
  imageUrl,
  imagePriority = false,
  time,
  title,
  place,
  distance,
  pace,
  isBungOwner,
}: {
  imageUrl: string
  imagePriority?: boolean
  time: string
  title: string
  place: string
  distance: number
  pace: string
  isBungOwner: boolean
}) {
  const { days, hours, minutes, seconds } = useTimer(time)
  const formattedTime = timerFormat({ days, hours, minutes, seconds })
  const formattedDate = formatDate({ date: time, formatStr: 'M월 d일 (E) a h:mm', convertUTCtoLocale: true })
  const 벙이시작되었는가 = days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0

  return (
    <article
      className={clsx(
        'active:scale-98 relative mx-auto h-184 w-full max-w-[500px] overflow-hidden rounded-8 p-16 text-white shadow-lg active-press-duration',
        벙이시작되었는가 && 'border-3 border-secondary',
      )}>
      <Image
        src={imageUrl}
        alt=''
        fill
        className='z-0 object-cover'
        sizes={CARD_IMAGE_SIZES}
        {...(imagePriority ? { priority: true } : { loading: 'lazy' as const })}
      />
      {벙이시작되었는가 && (
        <div
          className='absolute inset-0 z-10'
          style={{
            background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(224, 251, 96, 0.50) 100%)',
          }}
        />
      )}
      {isBungOwner ? <BoxedCrownIcon className='absolute right-16 top-16 z-30' size={24} color={colors.white} /> : null}
      <div className='relative z-20'>
        {벙이시작되었는가 ? (
          <RunStartedText className='mb-8 text-16' />
        ) : (
          <span className='mb-8 inline-flex text-16 font-black italic'>{formattedTime}</span>
        )}
        <p className='mb-8 truncate text-16 font-bold text-white'>{title}</p>
        <div className='mb-2 flex gap-6'>
          <PlaceIcon className='flex-shrink-0 translate-y-2' size={16} color={colors.white} />
          <span className='text-14 tracking-wide'>{place}</span>
        </div>
        <div className='mb-2 flex items-center gap-6'>
          <CalendarIcon size={16} color={colors.white} />
          <span className='text-14 tracking-wide'>{formattedDate}</span>
        </div>
        <div className='flex items-center gap-6'>
          <RunnerIcon size={16} color={colors.white} />
          <span className='font-jost text-14 tracking-wide'>
            {distance}km {pace}
          </span>
        </div>
      </div>
    </article>
  )
}
