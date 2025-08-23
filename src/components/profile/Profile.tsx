'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import AddressClipboard from '@shared/AddressClipboard'
import { useUserInfo } from '@apis/users/fetchUserInfo/query'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import ThumbIcon from '../icons/ThumbIcon'
import SettingModal from './SettingModal'

export default function Profile() {
  const { isApp } = useAppStore()
  const { data } = useUserInfo()
  const { showModal } = useModal()

  return (
    <section className='h-full w-full bg-gray-lighten'>
      <div className={clsx('h-full px-24', isApp ? 'pt-72' : 'pt-32')}>
        <header className='mb-12 flex items-center justify-between'>
          <h1 className='text-28 font-bold'>프로필</h1>
          <div className='flex items-center gap-8'>
            <Link href='/avatar'>
              <AvatarButton />
            </Link>
            <SettingButton
              onClick={() =>
                showModal({
                  key: MODAL_KEY.SETTING,
                  component: <SettingModal />,
                })
              }
            />
          </div>
        </header>

        <Image className='mx-auto mb-16' src='/temp/nft_profile_avatar.png' alt='avatar' width={76} height={76} />
        <h4 className='mb-4 text-center text-16 font-bold'>{data?.data.nickname}</h4>
        <AddressClipboard>
          {(address) => (
            <div className='mx-auto mb-8 flex w-fit cursor-pointer items-center gap-8 rounded-16 bg-white px-16 py-4'>
              <span className='text-14'>{address}</span>
              <svg width={16} height={16} viewBox='0 0 16 16'>
                <path
                  className='fill-black'
                  d='M12.667 2.33301H6V2.33398H4.66699V1H14V12.333H12.667V2.33301ZM2 15V3.66699H11.333V15H2Z'
                />
              </svg>
            </div>
          )}
        </AddressClipboard>

        <div className='mb-24 flex items-center gap-8 py-10'>
          <Record
            className='flex-1'
            icon={<ThumbIcon size={16} color={colors.black.DEFAULT} />}
            value={300}
            title='받은 좋아요'
          />
          <Record className='flex-1' icon={<CrownIcon />} value={78} title='개설한 벙' />
          <Record className='flex-1' icon={<FlagIcon />} value={120} title='획득한 NFT' />
        </div>

        <div className='mb-24 h-76 w-full rounded-8 bg-black-darken'>
          <Swiper
            className='h-full'
            modules={[Autoplay]}
            slidesPerView={1}
            centeredSlides
            loop
            direction='vertical'
            autoplay={{ delay: 3000 }}>
            <SwiperSlide>
              <RecentNftCard
                image='/temp/nft_profile_parts.png'
                title='이벤트 NFT 장착하고 성당 근처에서 달리기'
                description='도전과제 달성으로 획득'
                date='2024.12.25'
              />
            </SwiperSlide>
            <SwiperSlide>
              <RecentNftCard
                image='/temp/nft_profile_parts.png'
                title='비 오는 날 10km 달리기'
                description='특별 도전과제 달성으로 획득'
                date='2024.12.20'
              />
            </SwiperSlide>
            <SwiperSlide>
              <RecentNftCard
                image='/temp/nft_profile_parts.png'
                title='새벽 5시 러닝 클럽 참여'
                description='연속 참여 보상으로 획득'
                date='2024.12.15'
              />
            </SwiperSlide>
          </Swiper>
        </div>

        <div className='flex h-[calc(100%-495px)] w-full flex-col gap-8 overflow-y-auto scrollbar-hide'>
          <CompletedBung title='완료한 일정' location='서울 마포구 공덕동' date='6/11 (화) 오후 7:00' />
          <CompletedBung title='완료한 일정' location='서울 마포구 공덕동' date='6/11 (화) 오후 7:00' />
        </div>
      </div>
    </section>
  )
}

function AvatarButton() {
  return (
    <button className='flex h-40 w-40 items-center justify-center rounded-full bg-black-darken/10'>
      <svg width={16} height={16} viewBox='0 0 16 16'>
        <path
          className='fill-white'
          d='M15.4998 7.25L12.7732 9.125V14.001H3.22729V9.125L0.499756 7.25L3.90894 2H5.74976C5.74976 2.59664 5.98712 3.16888 6.40894 3.59082C6.83084 4.01272 7.4031 4.24993 7.99976 4.25C8.59649 4.25 9.16861 4.01277 9.59058 3.59082C10.0125 3.16885 10.2498 2.59675 10.2498 2H12.0906L15.4998 7.25Z'
        />
      </svg>
    </button>
  )
}

function SettingButton({ onClick }: { onClick?: () => void }) {
  return (
    <button className='flex h-40 w-40 items-center justify-center rounded-full bg-black-darken/10' onClick={onClick}>
      <svg width={16} height={16} viewBox='0 0 16 16'>
        <path
          className='fill-white'
          d='M14.0172 8.792L14.0091 8.808C14.0415 8.544 14.0738 8.272 14.0738 8C14.0738 7.728 14.0496 7.472 14.0172 7.208L14.0253 7.224L16 5.688L14.0334 2.312L11.7107 3.24L11.7188 3.248C11.2979 2.928 10.8366 2.656 10.3349 2.448H10.3429L9.97066 0H6.02934L5.67324 2.456H5.68134C5.17957 2.664 4.71826 2.936 4.29742 3.256L4.30551 3.248L1.97471 2.312L0 5.688L1.97471 7.224L1.9828 7.208C1.95043 7.472 1.92615 7.728 1.92615 8C1.92615 8.272 1.95043 8.544 1.9909 8.808L1.9828 8.792L0.283258 10.112L0.0161863 10.32L1.9828 13.68L4.31361 12.76L4.29742 12.728C4.72635 13.056 5.18766 13.328 5.69752 13.536H5.67324L6.03743 16H9.96257C9.96257 16 9.98685 15.856 10.0111 15.664L10.3187 13.544H10.3106C10.8123 13.336 11.2817 13.064 11.7107 12.736L11.6945 12.768L14.0253 13.688L15.9919 10.328C15.9919 10.328 15.8786 10.232 15.7248 10.12L14.0172 8.792ZM7.99595 10.8C6.43399 10.8 5.16338 9.544 5.16338 8C5.16338 6.456 6.43399 5.2 7.99595 5.2C9.55792 5.2 10.8285 6.456 10.8285 8C10.8285 9.544 9.55792 10.8 7.99595 10.8Z'
        />
      </svg>
    </button>
  )
}

function Record({
  icon,
  value,
  title,
  className,
}: {
  icon: React.ReactNode
  value: number
  title: string
  className?: string
}) {
  return (
    <div className={clsx('flex flex-col items-center', className)}>
      {icon}
      <span className='font-jost text-16 font-black'>{value}</span>
      <span className='text-10 font-medium text-gray-darken'>{title}</span>
    </div>
  )
}

function CrownIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <mask className='fill-white' id='path-1-inside-1_10104_2514'>
        <path d='M11.0264 8.05371L14 4V14H2V4L4.97266 8.05371L8 2L11.0264 8.05371Z' />
      </mask>
      <path className='fill-black' d='M11.0264 8.05371L14 4V14H2V4L4.97266 8.05371L8 2L11.0264 8.05371Z' />
      <path
        className='fill-black'
        d='M11.0264 8.05371L9.23745 8.94802L10.7019 11.8774L12.639 9.23667L11.0264 8.05371ZM14 4H16V-2.10778L12.3874 2.81704L14 4ZM14 14V16H16V14H14ZM2 14H0V16H2V14ZM2 4L3.61282 2.81729L0 -2.10939V4H2ZM4.97266 8.05371L3.35983 9.23642L5.29659 11.8775L6.76145 8.94825L4.97266 8.05371ZM8 2L9.78891 1.10569L8.00029 -2.47214L6.2112 1.10546L8 2ZM11.0264 8.05371L12.639 9.23667L15.6126 5.18296L14 4L12.3874 2.81704L9.41373 6.87075L11.0264 8.05371ZM14 4H12V14H14H16V4H14ZM14 14V12H2V14V16H14V14ZM2 14H4V4H2H0V14H2ZM2 4L0.387178 5.18271L3.35983 9.23642L4.97266 8.05371L6.58548 6.871L3.61282 2.81729L2 4ZM4.97266 8.05371L6.76145 8.94825L9.7888 2.89454L8 2L6.2112 1.10546L3.18386 7.15917L4.97266 8.05371ZM8 2L6.21109 2.89431L9.23745 8.94802L11.0264 8.05371L12.8153 7.1594L9.78891 1.10569L8 2Z'
        mask='url(#path-1-inside-1_10104_2514)'
      />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16'>
      <path
        className='fill-black'
        d='M1.53552 3.97656C1.85603 3.94882 2.14329 4.15343 2.2318 4.4502L2.25719 4.58301L3.12829 14.5449L1.80016 14.6611L0.92907 4.69922C0.901149 4.37852 1.10479 4.09045 1.40173 4.00195L1.53552 3.97656ZM13.0472 6.98242L15.3334 10.1328L10.1908 11.416L7.04723 10.249L4.00036 11.999L3.33337 4.53223L6.47594 2.66602L9.6195 3.94922L14.7621 2.66602L13.0472 6.98242Z'
      />
    </svg>
  )
}

function RecentNftCard({
  image,
  title,
  description,
  date,
  className,
}: {
  image: string
  title: string
  description: string
  date: string
  className?: string
}) {
  return (
    <div className={clsx('relative flex h-full w-full gap-8 rounded-8 p-8', className)}>
      <div className='size-60 flex-shrink-0 place-content-center place-items-center rounded-8 bg-gray-lighten'>
        <Image src={image} alt='parts' width={52} height={52} />
      </div>
      <div className='flex flex-col'>
        <span className='flex items-center gap-4 text-12 font-bold text-secondary'>
          최근 획득한 NFT
          <svg width='16' height='16' viewBox='0 0 16 16'>
            <path
              className='fill-secondary'
              d='M12.82 1.46422C12.8771 1.29057 13.1227 1.29057 13.1798 1.46422L13.4857 2.39413C13.5045 2.45128 13.5493 2.4961 13.6064 2.51489L14.5363 2.82072C14.71 2.87783 14.71 3.12347 14.5363 3.18058L13.6064 3.48641C13.5493 3.50521 13.5045 3.55002 13.4857 3.60717L13.1798 4.53708C13.1227 4.71073 12.8771 4.71073 12.82 4.53708L12.5142 3.60717C12.4954 3.55002 12.4505 3.50521 12.3934 3.48641L11.4635 3.18058C11.2898 3.12347 11.2898 2.87783 11.4635 2.82072L12.3934 2.51489C12.4505 2.4961 12.4954 2.45128 12.5142 2.39413L12.82 1.46422Z'
            />
            <path
              className='stroke-secondary'
              d='M8.01074 2.66797C8.01165 2.66982 8.01326 2.67257 8.01465 2.67676L9.11523 6.02441C9.24904 6.43125 9.56875 6.75096 9.97559 6.88477L13.3232 7.98535C13.3266 7.98648 13.3292 7.98745 13.3311 7.98828C13.3317 7.99021 13.333 7.99397 13.333 8C13.333 8.0052 13.3317 8.0086 13.3311 8.01074C13.3292 8.0116 13.3269 8.01345 13.3232 8.01465L9.97559 9.11523C9.56875 9.24904 9.24904 9.56875 9.11523 9.97559L8.01465 13.3232C8.01345 13.3269 8.0116 13.3292 8.01074 13.3311C8.0086 13.3317 8.0052 13.333 8 13.333C7.99397 13.333 7.99021 13.3317 7.98828 13.3311C7.98745 13.3292 7.98648 13.3266 7.98535 13.3232L6.88477 9.97559C6.75096 9.56875 6.43125 9.24904 6.02441 9.11523L2.67676 8.01465C2.67257 8.01326 2.66982 8.01165 2.66797 8.01074C2.66733 8.00857 2.66699 8.00498 2.66699 8C2.66699 7.99427 2.66729 7.99031 2.66797 7.98828C2.66982 7.98739 2.67285 7.98665 2.67676 7.98535L6.02441 6.88477C6.43125 6.75096 6.75096 6.43125 6.88477 6.02441L7.98535 2.67676C7.98665 2.67285 7.98739 2.66982 7.98828 2.66797C7.99031 2.66729 7.99427 2.66699 8 2.66699C8.00498 2.66699 8.00857 2.66733 8.01074 2.66797Z'
              strokeWidth='1.33333'
            />
          </svg>
        </span>
        <p className='text-12 text-white'>
          <strong>{title}</strong> {description}
        </p>
      </div>
      <span className='absolute bottom-8 right-8 text-10 text-gray-darker'>{date}</span>
    </div>
  )
}

function CompletedBung({ title, location, date }: { title: string; location: string; date: string }) {
  return (
    <div className='flex w-full items-center justify-between rounded-8 bg-white p-16'>
      <div className='flex gap-16'>
        <div className='size-40 place-content-center place-items-center rounded-8 bg-gray-lighten'>
          <svg width='16' height='16' viewBox='0 0 16 16'>
            <path
              className='fill-black-darken'
              d='M10.6672 3.58398L10.2375 6.00098H14.6672V9.66699L12.7922 14.667H6.00024V14.668H1.33325V6.00098H4.94849L6.66724 3.58398L7.33325 1.33398H10.6672V3.58398ZM2.66626 7.33398V14.667H4.66626V7.33398H2.66626ZM7.94556 3.96289L7.88306 4.17578L7.75415 4.35645L6.0354 6.77344L6.00024 6.82227V13.334H11.8684L13.3342 9.42578V7.33398H8.64673L8.92505 5.76758L9.33423 3.46582V2.66699H8.32935L7.94556 3.96289Z'
            />
          </svg>
        </div>

        <div className='flex flex-col'>
          <span className='text-12 font-bold'>{title}</span>
          <span className='text-10 font-medium'>{location}</span>
          <span className='text-10 font-medium'>{date}</span>
        </div>
      </div>

      <button className='rounded-8 bg-black-darken px-11 py-10 text-14 font-bold text-white'>피드백 남기기</button>
    </div>
  )
}
