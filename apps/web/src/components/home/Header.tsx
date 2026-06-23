import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { Weather } from '@type/weather'
import AddressClipboard from '@shared/AddressClipboard'
import { BellIcon } from '@icons/bell'
import { CopyClipboardIcon } from '@icons/clipboard'
import { UpperClothIcon } from '@icons/upper-cloth'
import useAppInsetSize from '@hooks/useAppInsetSize'
import { useAvatarPageWarmup } from '@hooks/useAvatarPageWarmup'
import useGeolocation from '@hooks/useGeolocation'
import { useReverseGeocoding } from '@apis/maps/reverse-geocoding/query'
import { useProfileSummary } from '@apis/v1/users/profile-summary/query'
import { useUserInfo } from '@apis/v1/users/query'
import { useCurrentWeather } from '@apis/weather/query'
import addDelimiter from '@utils/addDelimiter'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'
import { colors } from '@styles/colors'
import AvatarImageWarmup from '../avatar/AvatarImageWarmup'
import GlassSurface from '../shared/GlassSurface'

type WeatherSummary = { icon: string; temperature: number }

const FULL_HEADER_HEIGHT = 200
const HEADER_BG_FADE = 20

export default function Header() {
  const router = useRouter()
  const { userInfo } = useUserInfo()
  const { warmupAvatarPage, warmupImageUrls } = useAvatarPageWarmup()

  const { data: profileSummary } = useProfileSummary()
  const { location, refetch } = useGeolocation()
  const { data: reverseGeocode } = useReverseGeocoding(
    { lat: location?.lat ?? 0, lng: location?.lng ?? 0 },
    { enabled: location != null },
  )
  const { data: currentWeather } = useCurrentWeather(
    { lat: location?.lat ?? 0, lng: location?.lng ?? 0 },
    { enabled: location != null },
  )

  const weatherAssets = currentWeather ? getWeatherData(currentWeather.weather) : null
  const weatherBackground = weatherAssets?.background ?? weatherData.clouds.background.morning
  const addressSummary = location != null && reverseGeocode != null ? reverseGeocode : null
  const weatherSummary: WeatherSummary | null =
    location != null && currentWeather != null && weatherAssets != null
      ? { icon: weatherAssets.icon, temperature: currentWeather.temperature }
      : null
  const receivedLikeCount = profileSummary?.data.receivedLikeCount

  const appTopPadding = useAppInsetSize('top', 0)
  const fullHeight = FULL_HEADER_HEIGHT + appTopPadding
  const backgroundMask = `linear-gradient(to bottom, black ${fullHeight - HEADER_BG_FADE}px, transparent ${fullHeight}px)`

  return (
    <header
      className={clsx('fixed left-0 right-0 top-0 z-50 overflow-hidden', currentWeather == null && 'animate-pulse')}
      style={{ height: fullHeight }}>
      <div
        className='absolute inset-0 bg-white'
        style={{
          maskImage: backgroundMask,
          WebkitMaskImage: backgroundMask,
        }}
      />
      <div
        className='absolute inset-0'
        style={{
          maskImage: backgroundMask,
          WebkitMaskImage: backgroundMask,
          background: weatherBackground,
        }}
      />
      <AvatarImageWarmup imageUrls={warmupImageUrls.previewImageUrls} width={80} height={80} sizes='80px' limit={12} />
      <AvatarImageWarmup
        imageUrls={warmupImageUrls.wearableImageUrls}
        width={216}
        height={270}
        sizes='216px'
        limit={9}
      />

      <HeaderSection topPadding={appTopPadding}>
        <AvatarPane
          weatherImage={weatherAssets?.image ?? null}
          avatarImageUrl={userInfo?.profileImageUrl}
          feedback={receivedLikeCount}
        />
        <div className='flex flex-col'>
          <UserInfoRow nickname={userInfo?.nickname} />
          <WeatherDome address={addressSummary} weather={weatherSummary} onRefreshLocation={refetch} />
        </div>
      </HeaderSection>

      <div className='absolute inset-x-0' style={{ top: appTopPadding }}>
        <div className='absolute left-16 top-8'>
          <AvatarButton onPointerDown={warmupAvatarPage} onClick={() => router.push('/avatar')} />
        </div>
      </div>
    </header>
  )
}

function HeaderSection({
  topPadding,
  children,
}: {
  topPadding: number
  children: ReactNode
}) {
  return (
    <section className='absolute inset-x-0 flex h-[200px] w-full justify-between' style={{ top: topPadding }}>
      {children}
    </section>
  )
}

const AVATAR_PANE_STYLE = {
  pane: 'w-[176px]',
  avatar: 'left-[96px] h-200 w-200 -translate-x-1/2',
  avatarSizes: '200px',
  likeLabel: 'bottom-8 left-12',
} as const

function AvatarPane({
  weatherImage,
  avatarImageUrl,
  feedback,
}: {
  weatherImage: string | null
  avatarImageUrl: string | null | undefined
  feedback: number | undefined
}) {
  const resolvedAvatarImageUrl = avatarImageUrl || DEFAULT_PROFILE_IMAGE_URL

  return (
    <div className={clsx('relative flex flex-shrink-0 items-end justify-end', AVATAR_PANE_STYLE.pane)}>
      {weatherImage && (
        <Image
          className='object-cover'
          src={weatherImage}
          alt='Weather Image'
          fill
          priority
          sizes='(max-width: 768px) 100vw, 176px'
        />
      )}
      <Image
        className={clsx('absolute object-contain', AVATAR_PANE_STYLE.avatar)}
        src={resolvedAvatarImageUrl}
        alt='avatar'
        width={200}
        height={200}
        sizes={AVATAR_PANE_STYLE.avatarSizes}
        priority
      />

      <div className={clsx('absolute', AVATAR_PANE_STYLE.likeLabel)}>
        <SkewedLikeLabel like={feedback ?? 0} />
      </div>
    </div>
  )
}

const USER_INFO_ROW_STYLE = {
  margin: 'm-[8px_20px_16px]',
  nickname: 'text-20',
} as const

function UserInfoRow({ nickname }: { nickname: string | undefined }) {
  const router = useRouter()

  return (
    <div className={clsx('flex items-center justify-end gap-8', USER_INFO_ROW_STYLE.margin)}>
      <div className='flex flex-col items-end'>
        <span className={clsx('font-bold text-white', USER_INFO_ROW_STYLE.nickname)}>{nickname}</span>
        <AddressClipboard>
          {(address) => (
            <div className='flex -translate-y-2 translate-x-4 cursor-pointer items-center gap-6 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/20'>
              <span className='font-jost text-10 tracking-[0.04em] text-white'>{address}</span>
              <CopyClipboardIcon className='-translate-y-1' size={12} color={colors.white} />
            </div>
          )}
        </AddressClipboard>
      </div>
      <button
        className='rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/20'
        onClick={() => router.push('/notifications')}>
        <BellIcon className='-translate-y-1 translate-x-2' size={24} color={colors.white} />
      </button>
    </div>
  )
}

/** 큰 헤더의 주소·날씨 돔 — 탭바와 같은 리퀴드 글래스 표면 위에 옅은 날씨 틴트를 얹는다 */
function WeatherDome({
  address,
  weather,
  onRefreshLocation,
}: {
  address: string | null
  weather: WeatherSummary | null
  onRefreshLocation: () => void
}) {
  return (
    <div
      className='relative mr-32 flex w-[152px] flex-1 cursor-pointer flex-col items-center'
      onClick={() => onRefreshLocation()}>
      {/* GlassSurface는 네 모서리가 같은 radius라 높이를 80px 늘려 하단 코너를 클립 밖으로 밀어낸다 */}
      {/* mask로 유리 전체(프로스트·헤어라인·굴절)를 아래로 갈수록 녹여 헤더에 흡수시킨다.
          원래 bg-gradient-weather가 75%에서 완전 투명해지던 페이드를 따라가되,
          텍스트(상단 ~60%) 뒤에서는 유리가 온전히 남도록 55%까지 불투명 유지 */}
      <div
        className='absolute inset-0 z-0 overflow-hidden rounded-[80px_80px_0_0]'
        style={{
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 92%)',
        }}>
        <GlassSurface
          width='100%'
          height='calc(100% + 80px)'
          borderRadius={80}
          borderWidth={0.12}
          backgroundOpacity={0.1}
          distortionScale={-135}
          displace={7}
          greenOffset={6}
          blueOffset={12}
          saturation={1.8}
          blur={6}
          // 기본 box-shadow의 1px 풀 링은 슬랩처럼 보여 제거 — 상단 글린트만 남긴다
          style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)' }}
        />
        <div className='absolute inset-0 bg-gradient-weather opacity-20' />
      </div>
      {address == null ? (
        <div className='mt-24 h-16 w-80 animate-pulse rounded-10 bg-gray' />
      ) : (
        <span className='z-10 mt-24 text-12 text-white'>{address.split(' ').slice(1, 3).join(' ')}</span>
      )}
      {weather == null ? (
        <div className='mt-19 h-30 w-122 animate-pulse rounded-10 bg-gray' />
      ) : (
        <span className='z-10 mt-4 flex items-center gap-8 font-jost text-40 font-bold tracking-wide text-white'>
          {/* 아이콘 원본이 40x40 정사각이라 비율이 다른 width/height를 주면
              preflight(img { height: auto })가 height만 바꿔 next/image 경고가 발생한다 */}
          <Image src={weather.icon} alt='Weather Icon' width={41} height={41} />
          {Math.floor(weather.temperature)}°
        </span>
      )}
    </div>
  )
}

function AvatarButton({ onClick, onPointerDown }: { onClick?: () => void; onPointerDown?: () => void }) {
  return (
    <button
      className='group aspect-square w-40 rounded-full active-press-duration active:scale-90'
      onPointerDown={onPointerDown}
      onClick={onClick}>
      {/* 탭바 LiquidCenterVisual과 같은 글래스 렌즈 — 기존 다크 틴트는 아이콘 대비와 active 피드백용으로 유지 */}
      <GlassSurface
        width={40}
        height={40}
        borderRadius={20}
        borderWidth={0.16}
        backgroundOpacity={0.1}
        distortionScale={-100}
        displace={1}
        greenOffset={4}
        blueOffset={8}
        saturation={1.5}
        blur={4}
        // 기본 box-shadow의 흰 풀 링(0.45)은 어두운 날씨 그라데이션 위에서 도드라진다 —
        // 링·글린트 알파만 낮춰 은은한 림 라이트로 남기고, 어두운 배경에선 무의미한 외부 그림자는 제거
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        }}>
        <div className='absolute inset-0 bg-black-darken/10 group-active:bg-gray/20' />
        <span className='relative z-10 flex items-center justify-center'>
          <UpperClothIcon size={16} color={colors.white} />
        </span>
      </GlassSurface>
    </button>
  )
}

function SkewedLikeLabel({ like }: { like: number }) {
  return (
    <div className='flex h-28 skew-x-[-10deg] transform items-center justify-center gap-4 rounded-lg border-2 border-black bg-white px-8'>
      <Image src='/images/icon_thumbup.png' alt='Thumb Up Icon' width={16} height={16} />
      <span className='font-jost text-16 font-[900]'>{addDelimiter(like)}</span>
    </div>
  )
}

const weatherData = {
  clear: {
    image: '/images/home/bg_clear.png',
    icon: '/images/home/icon_clear.png',
    background: {
      morning: 'linear-gradient(180deg, #81C0FF 20%, rgba(195, 225, 255, 0.00) 100%)',
      afternoon: 'linear-gradient(180deg, #AAB9DF 30%, rgba(255, 145, 107, 0.30) 60%, rgba(255, 145, 107, 0.00) 100%)',
      night: 'linear-gradient(180deg, #002A51 20%, rgba(84, 103, 195, 0.90) 60%, rgba(92, 100, 175, 0.00) 100%)',
    },
  },
  clouds: {
    image: '/images/home/bg_clouds.png',
    icon: '/images/home/icon_clouds.png',
    background: {
      morning: 'linear-gradient(180deg, #B1B9CD 20%, rgba(137, 147, 157, 0.00) 100%)',
      afternoon: 'linear-gradient(180deg, #8C93A5 20%, rgba(223, 157, 128, 0.30) 60%, rgba(232, 71, 0, 0.00) 100%)',
      night: 'linear-gradient(180deg, #53555B 20%, rgba(96, 98, 105, 0.00) 100%)',
    },
  },
  rain: {
    image: '/images/home/bg_rain.png',
    icon: '/images/home/icon_rain.png',
    background: {
      morning: 'linear-gradient(180deg, #9DC7CD 20%, rgba(104, 201, 243, 0.00) 100%)',
      afternoon: 'linear-gradient(180deg, #513853 20%, rgba(173, 77, 71, 0.90) 60%, rgba(232, 71, 0, 0.00) 100%)',
      night: 'linear-gradient(180deg, #253232 20%, rgba(84, 117, 143, 0.90) 60%, rgba(50, 118, 148, 0.00) 100%)',
    },
  },
  snow: {
    image: '/images/home/bg_snow.png',
    icon: '/images/home/icon_snow.png',
    background: {
      morning: 'linear-gradient(180deg, #C1D6FF 20%, rgba(208, 224, 255, 0.00) 100%)',
      afternoon: 'linear-gradient(180deg, #7A95C9 20%, #E3C1D5 60%, rgba(255, 219, 239, 0.00) 100%)',
      night: 'linear-gradient(180deg, #1D499F 20%, rgba(84, 103, 195, 0.90) 60%, rgba(92, 100, 175, 0.00) 100%)',
    },
  },
} as const

function getWeatherData(weather: Weather) {
  const data = weatherData[weather]

  // 현재 시간 기준 오전 6시 ~ 오후 4시 사이면 오전, 오후 4시 ~ 오전 8시 사이면 오후, 나머지는 밤
  let period: 'morning' | 'afternoon' | 'night'
  const now = new Date()
  const hours = now.getHours()
  if (hours >= 6 && hours < 16) {
    period = 'morning'
  } else if (hours >= 16 && hours < 20) {
    period = 'afternoon'
  } else {
    period = 'night'
  }

  return {
    image: data.image,
    icon: data.icon,
    background: data.background[period],
  }
}
