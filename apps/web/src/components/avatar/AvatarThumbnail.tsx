import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Avatar } from '@type/avatar'
import { BackgroundOpenrunIcon } from '@icons/openrun'
import { colors } from '@styles/colors'
import { getAvatarPreviewImageUrl } from '@utils/avatarImage'

type AvatarThumbnailProps = {
  avatar: Avatar
}

export default function AvatarThumbnail({ avatar }: AvatarThumbnailProps) {
  const imageSrc = getAvatarPreviewImageUrl(avatar)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
  }, [imageSrc])

  return (
    <div className='relative aspect-square w-full max-w-80 overflow-hidden rounded-8'>
      <AvatarThumbnailSkeleton isVisible={!isLoaded} />
      <Image
        alt='아바타 파츠'
        src={imageSrc}
        loading='lazy'
        fill
        sizes='80px'
        className={clsx(
          'object-contain transition-opacity duration-150 ease-out',
          isLoaded ? 'opacity-100' : 'opacity-0',
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}

function AvatarThumbnailSkeleton({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      aria-hidden='true'
      className={clsx(
        'absolute inset-0 flex items-center justify-center rounded-8 bg-white/40 transition-opacity duration-150',
        isVisible ? 'opacity-100' : 'opacity-0',
      )}>
      <BackgroundOpenrunIcon size={54} color={colors.gray.darken} className='h-auto animate-pulse opacity-[0.45]' />
    </div>
  )
}
