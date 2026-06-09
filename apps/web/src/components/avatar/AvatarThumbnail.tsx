import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Avatar } from '@type/avatar'
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
      <div className='relative h-[64px] w-[56px] animate-pulse'>
        <span className='absolute left-1/2 top-4 h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-gray' />
        <span className='absolute left-1/2 top-[28px] h-[30px] w-[42px] -translate-x-1/2 rounded-[22px_22px_12px_12px] bg-gray' />
        <span className='absolute left-4 top-[33px] h-[24px] w-[10px] rotate-12 rounded-full bg-gray' />
        <span className='absolute right-4 top-[33px] h-[24px] w-[10px] -rotate-12 rounded-full bg-gray' />
      </div>
    </div>
  )
}
