'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useModal } from '@contexts/ModalProvider'
import AddressClipboard from '@shared/AddressClipboard'
import GlassSurface from '@shared/GlassSurface'
import { profileAnalytics } from '@analytics'
import { CopyClipboardIcon } from '@icons/clipboard'
import { CrownIcon } from '@icons/crown'
import { FilledFlagIcon } from '@icons/flag'
import { SettingIcon } from '@icons/setting'
import { StarIcon } from '@icons/star'
import { FilledThumbIcon, OutlinedThumbIcon } from '@icons/thumb'
import { UpperClothIcon } from '@icons/upper-cloth'
import useAppInsetSize from '@hooks/useAppInsetSize'
import { useMyBungs } from '@apis/v1/bungs/my-bungs/query'
import { useProfileSummary } from '@apis/v1/users/profile-summary/query'
import { useUserInfo } from '@apis/v1/users/query'
import { MODAL_KEY } from '@constants/modal'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'
import type { ApiDateTime } from '@utils/api'
import { colors } from '@styles/colors'
import SettingModal from './SettingModal'

export default function Profile() {
  const { userInfo } = useUserInfo()
  const { data: profileSummary } = useProfileSummary()
  const { data: completedBungs } = useMyBungs({
    isOwned: null,
    status: 'ACCOMPLISHED',
    page: 0,
    limit: 10,
  })
  const { showModal } = useModal()
  const summary = profileSummary?.data
  const recentAcquiredNfts = summary?.recentAcquiredNfts ?? []
  const completedBungList = completedBungs?.data ?? []
  const topPadding = useAppInsetSize('top', 32)
  const scrollBottomPadding = useAppInsetSize('bottom', 104)

  return (
    <section className='h-full w-full bg-gray-lighten'>
      <div className='flex h-full flex-col px-24 pt-32' style={{ paddingTop: topPadding }}>
        <header className='mb-12 flex items-center justify-between'>
          <h1 className='text-28 font-bold'>프로필</h1>
          <div className='flex items-center gap-8'>
            <Link href='/avatar' aria-label='아바타 페이지로 이동' className={PROFILE_ACTION_BUTTON_CLASS}>
              <ProfileActionGlass>
                <UpperClothIcon size={16} color={colors.white} />
              </ProfileActionGlass>
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

        <div className='mx-auto mb-8 size-[112px] shrink-0'>
          <Image
            className='size-full object-contain'
            src={userInfo?.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
            alt='avatar'
            width={112}
            height={112}
          />
        </div>
        <h4 className='mb-4 text-center text-16 font-bold'>{userInfo?.nickname}</h4>
        <AddressClipboard>
          {(address) => (
            <div className='mx-auto mb-8 flex w-fit cursor-pointer items-center gap-8 rounded-16 bg-white px-16 py-4 active-press-duration active:scale-95 active:bg-gray/30'>
              <span className='font-jost text-14 tracking-[0.035em]'>{address}</span>
              <CopyClipboardIcon size={16} color={colors.black.DEFAULT} />
            </div>
          )}
        </AddressClipboard>

        <div className='mb-24 flex items-center gap-8 py-10'>
          <Record
            className='flex-1'
            icon={<FilledThumbIcon size={16} color={colors.black.DEFAULT} />}
            value={summary?.receivedLikeCount ?? 0}
            title='받은 좋아요'
          />
          <Record
            className='flex-1'
            icon={<CrownIcon size={16} color={colors.black.DEFAULT} />}
            value={summary?.currentOwnedBungCount ?? 0}
            title='개설한 벙'
          />
          <Record
            className='flex-1'
            icon={<FilledFlagIcon size={16} color={colors.black.DEFAULT} />}
            value={summary?.acquiredNftCount ?? 0}
            title='획득한 NFT'
          />
        </div>

        <div
          className='flex min-h-0 flex-1 w-full flex-col gap-8 overflow-y-auto scrollbar-hide'
          style={{ paddingBottom: scrollBottomPadding }}>
          {recentAcquiredNfts.length > 0 && (
            <div className='mb-16 h-76 w-full shrink-0 rounded-8 bg-black-darken'>
              <Swiper
                className='h-full'
                modules={[Autoplay]}
                slidesPerView={1}
                centeredSlides
                loop={recentAcquiredNfts.length > 1}
                direction='vertical'
                autoplay={{ delay: 3000 }}>
                {recentAcquiredNfts.map((recentNft) => (
                  <SwiperSlide key={recentNft.userChallengeId}>
                    <RecentNftCard
                      image={recentNft.nft.image || DEFAULT_PROFILE_IMAGE_URL}
                      title={recentNft.challengeName}
                      description={recentNft.nft.description || recentNft.nft.name || '도전과제 달성으로 획득'}
                      date={formatProfileDate(recentNft.acquiredAt)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {completedBungList.map((bung) => (
            <CompletedBung
              key={bung.bungId}
              bungId={bung.bungId}
              title={bung.name}
              location={bung.location}
              date={formatBungDate(bung.startDateTime)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function formatProfileDate(dateTime: ApiDateTime) {
  if (dateTime == null) {
    return ''
  }

  if (Array.isArray(dateTime)) {
    const [year, month, day] = dateTime

    if (year == null || month == null || day == null) {
      return ''
    }

    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`
  }

  const date = dateTime.trim().split(/[ T]/)[0]

  return date.replaceAll('-', '.')
}

function formatBungDate(dateTime: string) {
  const [date, time = ''] = dateTime.split(' ')
  const [year, month, day] = date.split('-').map(Number)
  const [hour = 0, minute = 0] = time.split(':').map(Number)

  if (year == null || month == null || day == null || Number.isNaN(month) || Number.isNaN(day)) {
    return dateTime
  }

  const dayName = ['일', '월', '화', '수', '목', '금', '토'][new Date(year, month - 1, day).getDay()]
  const period = hour >= 12 ? '오후' : '오전'
  const displayHour = hour % 12 || 12

  return `${month}/${day} (${dayName}) ${period} ${displayHour}:${String(minute).padStart(2, '0')}`
}

const PROFILE_ACTION_BUTTON_CLASS =
  'group inline-flex h-40 w-40 items-center justify-center rounded-full active-press-duration active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-lighten'

const PROFILE_ACTION_GLASS_PROPS = {
  width: 40,
  height: 40,
  borderRadius: 20,
  borderWidth: 0.16,
  backgroundOpacity: 0.1,
  distortionScale: -100,
  displace: 1,
  greenOffset: 4,
  blueOffset: 8,
  saturation: 1.5,
  blur: 4,
} as const

const PROFILE_ACTION_GLASS_STYLE = {
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
} as const

function ProfileActionGlass({ children }: { children: React.ReactNode }) {
  return (
    <GlassSurface {...PROFILE_ACTION_GLASS_PROPS} style={PROFILE_ACTION_GLASS_STYLE}>
      <div className='absolute inset-0 bg-black-darken/10 group-active:bg-black-darken/14' />
      <span className='relative z-10 flex items-center justify-center'>{children}</span>
    </GlassSurface>
  )
}

function SettingButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type='button' aria-label='설정 열기' className={PROFILE_ACTION_BUTTON_CLASS} onClick={onClick}>
      <ProfileActionGlass>
        <SettingIcon size={16} color={colors.white} />
      </ProfileActionGlass>
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
          <StarIcon size={16} color={colors.secondary} />
        </span>
        <p className='text-12 text-white'>
          <strong>{title}</strong> {description}
        </p>
      </div>
      <span className='absolute bottom-8 right-8 text-10 text-gray-darker'>{date}</span>
    </div>
  )
}

function CompletedBung({
  bungId,
  title,
  location,
  date,
}: {
  bungId: string
  title: string
  location: string
  date: string
}) {
  return (
    <div className='flex w-full items-center gap-12 rounded-8 bg-white p-16'>
      <div className='flex min-w-0 flex-1 gap-16'>
        <div className='flex size-40 shrink-0 items-center justify-center rounded-8 bg-gray-lighten'>
          <OutlinedThumbIcon size={16} color={colors.black.darken} />
        </div>

        <div className='flex min-w-0 flex-col'>
          <span className='truncate text-14 font-bold leading-[1.25]'>{title}</span>
          <span className='truncate text-12 font-medium leading-[1.25]'>{location}</span>
          <span className='truncate text-12 font-medium leading-[1.25]'>{date}</span>
        </div>
      </div>

      <Link
        href={`/bung/${bungId}`}
        onClick={() => profileAnalytics.feedbackClicked({ bungId })}
        className='flex h-40 w-100 shrink-0 items-center justify-center whitespace-nowrap rounded-8 bg-black-darken text-14 font-bold text-white active-press-duration active:scale-95 active:bg-black-darken/80'>
        피드백 남기기
      </Link>
    </div>
  )
}
