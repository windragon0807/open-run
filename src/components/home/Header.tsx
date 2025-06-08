'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useAppStore } from '@store/app'
import { useUserStore } from '@store/user'
import { Weather } from '@type/weather'
import BellIcon from '@icons/BellIcon'
import { useAppRouter } from '@hooks/useAppRouter'
import useGeolocation from '@hooks/useGeolocation'
import useLogout from '@hooks/useLogout'
import { useReverseGeocoding } from '@apis/maps/reverse-geocoding/query'
import { useCurrentWeather } from '@apis/weather/query'
import addDelimiter from '@utils/addDelimiter'
import { colors } from '@styles/colors'

export default function Header() {
  const { isApp } = useAppStore()
  const appRouter = useAppRouter()
  const { userInfo } = useUserStore()
  const { logout } = useLogout()

  const { location } = useGeolocation()
  const { data: reverseGeocode, isLoading: isReverseGeocodeLoading } = useReverseGeocoding(
    { lat: location?.lat ?? 0, lng: location?.lng ?? 0 },
    { enabled: location != null },
  )
  const { data: currentWeather, isLoading: isCurrentWeatherLoading } = useCurrentWeather(
    { lat: location?.lat ?? 0, lng: location?.lng ?? 0 },
    { enabled: location != null },
  )

  return (
    <header
      className={clsx(isApp && 'pt-[64px]', currentWeather == null && 'animate-pulse')}
      style={{
        background: currentWeather
          ? getWeatherData(currentWeather.weather).background
          : weatherData.clouds.background.morning,
      }}>
      <section className='flex h-[200px] w-full justify-between'>
        <div className='relative flex w-[176px] flex-shrink-0 items-end justify-end'>
          {currentWeather && (
            <Image
              className='absolute object-cover'
              src={getWeatherData(currentWeather.weather).image}
              alt='Weather Image'
              fill
              priority
              sizes='(max-width: 768px) 100vw, 176px'
            />
          )}
          <Image
            className='absolute border'
            src='/temp/nft_character_lg.png'
            alt='NFT Character'
            width={160}
            height={200}
            priority
          />
          <div className={clsx('absolute left-16', isApp ? 'top-0' : 'top-8')}>
            <AvatarButton onClick={() => appRouter.push('/avatar')} />
          </div>
          <div className='absolute bottom-8 left-12'>
            <SkewedLikeLabel like={300} />
          </div>
        </div>

        <div className='flex flex-col'>
          <div className='m-[16px_24px_16px] flex items-center justify-end gap-8'>
            <span className='text-20 font-bold text-white'>{userInfo?.nickname}</span>
            <button className='-translate-y-2' onClick={logout}>
              <BellIcon size={24} color={colors.white} />
            </button>
          </div>
          <div className='relative mr-32 flex w-[152px] flex-1 flex-col items-center'>
            <div className='absolute z-0 h-full w-full rounded-[80px_80px_0_0] bg-gradient-weather opacity-30' />
            {location == null || isReverseGeocodeLoading ? (
              <div className='mt-24 h-16 w-80 animate-pulse rounded-10 bg-gray-default' />
            ) : (
              <span className='z-10 mt-24 text-12 text-white'>{reverseGeocode ?? ''}</span>
            )}
            {location == null || isCurrentWeatherLoading ? (
              <div className='mt-19 h-30 w-122 animate-pulse rounded-10 bg-gray-default' />
            ) : (
              <span className='z-10 mt-4 flex items-center gap-8 font-jost text-40 font-bold tracking-wide text-white'>
                <Image
                  src={getWeatherData(currentWeather?.weather ?? 'clear').icon}
                  alt='Weather Icon'
                  width={41}
                  height={24}
                />
                {Math.floor(currentWeather?.temperature ?? 0)}°
              </span>
            )}
          </div>
        </div>
      </section>
    </header>
  )
}

function AvatarButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className='flex aspect-square w-40 items-center justify-center rounded-full bg-black-darken/10'
      onClick={onClick}>
      <svg width={16} height={16} viewBox='0 0 16 16'>
        <path
          className='fill-white'
          d='M15.4998 7.25L12.7732 9.125V14.001H3.22729V9.125L0.499756 7.25L3.90894 2H5.74976C5.74976 2.59664 5.98712 3.16888 6.40894 3.59082C6.83084 4.01272 7.4031 4.24993 7.99976 4.25C8.59649 4.25 9.16861 4.01277 9.59058 3.59082C10.0125 3.16885 10.2498 2.59675 10.2498 2H12.0906L15.4998 7.25Z'
        />
      </svg>
    </button>
  )
}

function SkewedLikeLabel({ like }: { like: number }) {
  return (
    <div className='flex h-28 skew-x-[-10deg] transform items-center justify-center gap-4 rounded-lg border-2 border-black-default bg-white px-8'>
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
