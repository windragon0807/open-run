import clsx from 'clsx'
import { motion, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { useAppStore } from '@store/app'
import { useUserStore } from '@store/user'
import { WearingAvatar } from '@type/avatar'
import { Weather } from '@type/weather'
import AddressClipboard from '@shared/AddressClipboard'
import Avatar from '@shared/Avatar'
import { BellIcon } from '@icons/bell'
import { CopyClipboardIcon } from '@icons/clipboard'
import { UpperClothIcon } from '@icons/upper-cloth'
import { useAvatarPageWarmup } from '@hooks/useAvatarPageWarmup'
import useGeolocation from '@hooks/useGeolocation'
import { useReverseGeocoding } from '@apis/maps/reverse-geocoding/query'
import { useWearingNftAvatarQuery } from '@apis/v1/nft/avatar-items/query'
import { useCurrentWeather } from '@apis/weather/query'
import addDelimiter from '@utils/addDelimiter'
import { colors } from '@styles/colors'
import AvatarImageWarmup from '../avatar/AvatarImageWarmup'
import GlassSurface from '../shared/GlassSurface'

type HeaderSize = 'large' | 'small'
type WeatherSummary = { icon: string; temperature: number }

const FULL_HEADER_HEIGHT = 200
const SMALL_HEADER_HEIGHT = 90
const COLLAPSE_DISTANCE = FULL_HEADER_HEIGHT - SMALL_HEADER_HEIGHT
/** 축소 시 배경을 클립선 아래로 이만큼 더 남긴다 — 높이에 딱 맞춰 압축하면
    그라데이션이 클립선 직전에 투명해져 날씨 필이 배경을 삐져나온 것처럼 보인다 */
const COLLAPSED_BG_OVERFLOW = 60
/** 클립선 직전에서 배경을 투명으로 녹이는 화면 기준 페이드 길이(px) — OVERFLOW로 색을 남기면
    클립선에서 색이 산 채로 잘려 하드 엣지가 생기므로 mask로 마지막 구간을 부드럽게 끊는다.
    날씨 필 하단(~78px + topPadding)과 클립선(90px + topPadding) 사이에서 시작해야
    필 뒤 색 유지와 페이드 부드러움이 같이 산다 */
const COLLAPSED_BG_FADE = 20
const COLLAPSE_SPRING = { stiffness: 280, damping: 32, mass: 0.55 }
const SECTION_FADE = { duration: 0.2, ease: 'easeOut' } as const

export default function Header({ isSmallHeaderActive }: { isSmallHeaderActive: boolean }) {
  const router = useRouter()
  const { isApp, insets } = useAppStore()
  const { userInfo } = useUserStore()
  const { warmupAvatarPage, warmupImageUrls } = useAvatarPageWarmup()

  const { data: wearingAvatar } = useWearingNftAvatarQuery()
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

  const appTopPadding = insets ? insets.top + 5 : isApp ? 64 : 0
  const fullHeight = FULL_HEADER_HEIGHT + appTopPadding

  // height를 직접 애니메이션하면 매 프레임 리플로우가 발생한다 — 높이는 fullHeight로 고정하고
  // clip-path(히트테스트도 함께 잘린다)와 배경 scaleY 조합으로 동일한 축소 모양을 만든다
  const collapse = useSpring(isSmallHeaderActive ? 1 : 0, COLLAPSE_SPRING)
  useEffect(() => {
    collapse.set(isSmallHeaderActive ? 1 : 0)
  }, [collapse, isSmallHeaderActive])
  const clipPath = useTransform(collapse, (progress) => `inset(0px 0px ${progress * COLLAPSE_DISTANCE}px 0px)`)
  // 배경은 클립보다 COLLAPSED_BG_OVERFLOW만큼 덜 압축한다 — 넘치는 부분은 clip-path가 잘라낸다
  const backgroundScaleY = useTransform(
    collapse,
    (progress) => 1 - (progress * (COLLAPSE_DISTANCE - COLLAPSED_BG_OVERFLOW)) / fullHeight,
  )
  // mask는 scaleY 이전 로컬 박스에 적용된 뒤 함께 압축되므로, 화면 기준 페이드 위치를
  // scale로 나눠 로컬 좌표로 역환산한다 — 펼침(p=0)에선 페이드 구간이 그라데이션이
  // 이미 알파 0으로 끝나는 마지막 20px과 겹쳐 기존 모습과 사실상 동일하다
  const backgroundMask = useTransform(collapse, (progress) => {
    const scale = 1 - (progress * (COLLAPSE_DISTANCE - COLLAPSED_BG_OVERFLOW)) / fullHeight
    const visibleBottom = fullHeight - progress * COLLAPSE_DISTANCE
    const startLocal = (visibleBottom - COLLAPSED_BG_FADE) / scale
    const endLocal = visibleBottom / scale
    return `linear-gradient(to bottom, black ${startLocal}px, transparent ${endLocal}px)`
  })

  return (
    <motion.header
      className={clsx('fixed left-0 right-0 top-0 z-50 overflow-hidden', currentWeather == null && 'animate-pulse')}
      style={{ height: fullHeight, clipPath }}>
      <motion.div
        className='absolute inset-0 origin-top'
        style={{
          scaleY: backgroundScaleY,
          maskImage: backgroundMask,
          WebkitMaskImage: backgroundMask,
          background: isSmallHeaderActive
            ? `${weatherBackground}, linear-gradient(to bottom, white 80%, transparent 100%)`
            : weatherBackground,
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

      <HeaderSection size='large' visible={!isSmallHeaderActive} topPadding={appTopPadding}>
        <AvatarPane size='large' weatherImage={weatherAssets?.image ?? null} avatar={wearingAvatar?.data} />
        <div className='flex flex-col'>
          <UserInfoRow size='large' nickname={userInfo?.nickname} />
          <WeatherDome address={addressSummary} weather={weatherSummary} onRefreshLocation={refetch} />
        </div>
      </HeaderSection>

      <HeaderSection size='small' visible={isSmallHeaderActive} topPadding={appTopPadding}>
        <AvatarPane size='small' weatherImage={weatherAssets?.image ?? null} avatar={wearingAvatar?.data} />
        <div className='flex flex-col'>
          <UserInfoRow size='small' nickname={userInfo?.nickname} />
        </div>
      </HeaderSection>

      {/* 글래스 버튼은 섹션 밖에 한 번만 렌더한다 — 섹션 opacity 페이드가 backdrop root를 만들어
          전환 중 backdrop-filter가 헤더 배경 대신 섹션 내부만 샘플링해 렌즈 색이 튀고,
          섹션 y 이동을 함께 타며 꿀렁이기 때문. 버튼 위치는 큰/작은 헤더에서 동일하다 */}
      <div className='absolute inset-x-0' style={{ top: appTopPadding }}>
        <div className='absolute left-16 top-8 app:top-0'>
          <AvatarButton onPointerDown={warmupAvatarPage} onClick={() => router.push('/avatar')} />
        </div>
      </div>
    </motion.header>
  )
}

const SECTION_STYLE = {
  large: { height: 'h-[200px]', hiddenY: -18 },
  small: { height: 'h-[90px]', hiddenY: -14 },
} as const

function HeaderSection({
  size,
  visible,
  topPadding,
  children,
}: {
  size: HeaderSize
  visible: boolean
  topPadding: number
  children: ReactNode
}) {
  const style = SECTION_STYLE[size]

  return (
    <motion.section
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : style.hiddenY }}
      transition={SECTION_FADE}
      className={clsx(
        'absolute inset-x-0 flex w-full justify-between',
        style.height,
        !visible && 'pointer-events-none',
      )}
      style={{ top: topPadding }}>
      {children}
    </motion.section>
  )
}

const AVATAR_PANE_STYLE = {
  large: { pane: 'w-[176px]', avatar: 'h-200 w-160', avatarSizes: '160px', likeLabel: 'bottom-8 left-12' },
  small: { pane: 'w-[118px]', avatar: 'h-90 w-68', avatarSizes: '68px', likeLabel: 'bottom-8 left-8' },
} as const

function AvatarPane({
  size,
  weatherImage,
  avatar,
}: {
  size: HeaderSize
  weatherImage: string | null
  avatar: WearingAvatar | undefined
}) {
  const style = AVATAR_PANE_STYLE[size]

  return (
    <div className={clsx('relative flex flex-shrink-0 items-end justify-end', style.pane)}>
      {weatherImage &&
        (size === 'large' ? (
          <Image
            className='object-cover'
            src={weatherImage}
            alt='Weather Image'
            fill
            priority
            sizes='(max-width: 768px) 100vw, 176px'
          />
        ) : (
          // 원본(176x200) 비율상 height가 90.9px로 계산돼 height 속성(90)과 어긋나며 next/image 경고가 난다.
          // CSS로 양쪽 크기를 고정해 선언 크기 그대로 렌더하고 object-cover로 비율 차이를 흡수한다.
          <Image
            className='absolute h-90 w-80 object-cover'
            src={weatherImage}
            alt='Weather Image'
            width={80}
            height={90}
            priority
          />
        ))}
      {avatar && <Avatar className={clsx('absolute', style.avatar)} sizes={style.avatarSizes} {...avatar} />}

      {size === 'large' && (
        <div className={clsx('absolute', style.likeLabel)}>
          <SkewedLikeLabel like={300} />
        </div>
      )}
    </div>
  )
}

const USER_INFO_ROW_STYLE = {
  large: { margin: 'm-[8px_20px_16px]', nickname: 'text-20' },
  small: { margin: 'm-[8px_20px_10px]', nickname: 'text-16' },
} as const

function UserInfoRow({ size, nickname }: { size: HeaderSize; nickname: string | undefined }) {
  const router = useRouter()
  const style = USER_INFO_ROW_STYLE[size]

  return (
    <div className={clsx('flex items-center justify-end gap-8', style.margin)}>
      <div className='flex flex-col items-end'>
        <span className={clsx('font-bold text-white', style.nickname)}>{nickname}</span>
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
  let background: string
  const now = new Date()
  const hours = now.getHours()
  if (hours >= 6 && hours < 16) {
    background = data.background.morning
  } else if (hours >= 16 && hours < 20) {
    background = data.background.afternoon
  } else {
    background = data.background.night
  }

  return {
    image: data.image,
    icon: data.icon,
    background,
  }
}
