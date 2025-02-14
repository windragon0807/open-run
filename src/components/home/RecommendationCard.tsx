import Spacing from '@shared/Spacing'
import PlaceIcon from '@icons/PlaceIcon'
import CalendarIcon from '@icons/CalendarIcon'
import { formatDate } from '@utils/time'
import { colors } from '@styles/colors'
import Avatar from './Avatar'

const participantList = [
  '/temp/nft_participant_5.png',
  '/temp/nft_participant_4.png',
  '/temp/nft_participant_3.png',
  '/temp/nft_participant_2.png',
  '/temp/nft_participant_1.png',
]

export default function RecommendationCard({
  title,
  location,
  time,
  remainingCount,
  hashtags,
}: {
  title: string
  location: string
  time: Date
  remainingCount: number
  hashtags: string[]
}) {
  // 남은 시간을 상태로 관리
  const formattedDate = formatDate(time, 'M월 d일 (E) a h:mm')

  return (
    <article
      className='relative w-full max-w-[500px] mx-auto bg-black-default h-200 rounded-8 p-16 text-white bg-cover bg-center'
      style={{ backgroundImage: "url('/temp/img_thumbnail_2.png')" }}>
      <span className='text-[16px] font-bold leading-[24px] tracking-[-0.32px]'>{title}</span>
      <Spacing size={8} />
      <div className='flex gap-6 items-center'>
        <PlaceIcon size={16} color={colors.white} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>{location}</span>
      </div>
      <Spacing size={2} />
      <div className='flex gap-6 items-center'>
        <CalendarIcon size={16} color={colors.white} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px]'>{formattedDate}</span>
      </div>
      <Spacing size={12} />
      <div className='flex items-center'>
        {participantList.map((src, index) => (
          <Avatar key={src} className={index !== 0 ? '-ml-12' : ''} imageSrc={src} size={35} />
        ))}
        <Spacing direction='horizontal' size={8} />
        <span>{remainingCount} 자리 남음</span>
      </div>
      <div className='absolute flex bottom-16 left-16 gap-4'>
        {hashtags.map((value) => (
          <div key={`tag-${value}`} className='bg-black-darken/60 px-6 text-white rounded-4'>
            <span className='text-[12px] leading-[16px] tracking-[-0.24px]'>{value}</span>
          </div>
        ))}
      </div>
    </article>
  )
}
