import Image from 'next/image'
import Spacing from '@shared/Spacing'
import { CalendarIcon } from '@icons/calendar'
import { PlaceIcon } from '@icons/place'
import { formatDate } from '@utils/time'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'
import { colors } from '@styles/colors'
import Avatar from './Avatar'

const CARD_IMAGE_SIZES = '(max-width: 532px) calc(100vw - 32px), 500px'

export default function RecommendationCard({
  imageUrl,
  imagePriority = false,
  title,
  location,
  time,
  remainingCount,
  hashtags,
  participantImageUrls,
}: {
  imageUrl: string
  imagePriority?: boolean
  title: string
  location: string
  time: string
  remainingCount: number
  hashtags: string[]
  participantImageUrls: Array<string | null | undefined>
}) {
  // 남은 시간을 상태로 관리
  const formattedDate = formatDate({ date: time, formatStr: 'M월 d일 (E) a h:mm', convertUTCtoLocale: true })
  const participantList = participantImageUrls.slice(0, 5).map((imageUrl) => imageUrl || DEFAULT_PROFILE_IMAGE_URL)

  return (
    <article className='active:scale-98 relative mx-auto h-200 w-full max-w-[500px] overflow-hidden rounded-8 p-16 text-white shadow-lg active-press-duration'>
      <Image
        src={imageUrl}
        alt=''
        fill
        className='z-0 object-cover'
        sizes={CARD_IMAGE_SIZES}
        {...(imagePriority ? { priority: true } : { loading: 'lazy' as const })}
      />
      <div className='relative z-10'>
        <span className='text-16 font-bold'>{title}</span>
        <Spacing size={8} />
        <div className='mb-2 flex gap-6'>
          <PlaceIcon className='translate-y-2' size={16} color={colors.white} />
          <span className='text-14 tracking-wide'>{location}</span>
        </div>
        <div className='flex items-center gap-6'>
          <CalendarIcon size={16} color={colors.white} />
          <span className='text-14 tracking-wide'>{formattedDate}</span>
        </div>
        <Spacing size={12} />
        <div className='flex items-center'>
          {participantList.map((src, index) => (
            <Avatar key={`${src}-${index}`} className={index !== 0 ? '-ml-12' : ''} imageSrc={src} size={35} />
          ))}
          <Spacing direction='horizontal' size={8} />
          <span>{remainingCount} 자리 남음</span>
        </div>
      </div>
      <div className='absolute bottom-16 left-16 z-10 flex gap-4'>
        {hashtags.map((value) => (
          <div key={`tag-${value}`} className='rounded-4 bg-black-darken/60 px-6 text-white'>
            <span className='text-12'>{value}</span>
          </div>
        ))}
      </div>
    </article>
  )
}
