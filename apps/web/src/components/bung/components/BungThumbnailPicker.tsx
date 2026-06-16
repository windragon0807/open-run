import clsx from 'clsx'
import Image from 'next/image'
import { ReactNode, useState } from 'react'
import GlassSurface from '@shared/GlassSurface'
import { CircleCheckIcon } from '@icons/circle-check'
import { ImageIcon } from '@icons/image'
import { RandomIcon } from '@icons/random'
import { colors } from '@styles/colors'

type BungThumbnailPickerProps = {
  value: string
  images: string[]
  onChange: (imageUrl: string) => void
  onRandom: () => void
  title?: string
  autoCollapseOnSelect?: boolean
}

export default function BungThumbnailPicker({
  value,
  images,
  onChange,
  onRandom,
  title = '배경 선택',
  autoCollapseOnSelect = true,
}: BungThumbnailPickerProps) {
  const [isGalleryOpen, setGalleryOpen] = useState(false)

  const selectedImage = value || images[0] || ''

  return (
    <section className='relative z-20 mb-32'>
      <div className='relative mx-auto h-184 w-full overflow-hidden rounded-8'>
        <Image className='object-cover' src={selectedImage} alt='Bung Background Image' fill />
        <div className='absolute bottom-16 right-16 flex gap-8'>
          <ThumbnailGlassButton
            ariaLabel={isGalleryOpen ? '배경 닫기' : '전체 배경 보기'}
            onClick={() => setGalleryOpen((prev) => !prev)}>
            <ImageIcon size={24} color={colors.white} />
          </ThumbnailGlassButton>
          <ThumbnailGlassButton ariaLabel='랜덤 배경 선택' onClick={onRandom}>
            <RandomIcon size={24} color={colors.white} />
          </ThumbnailGlassButton>
        </div>
      </div>

      <div
        aria-hidden={!isGalleryOpen}
        className={clsx(
          'absolute left-0 right-0 top-[calc(100%+12px)] z-30 rounded-8 border border-gray bg-white p-12 shadow-floating-primary transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
          isGalleryOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}>
        <div className='mb-10 flex items-center justify-between'>
          <span className='text-14 font-semibold text-black'>{title}</span>
          <span className='text-12 text-gray-darken'>{images.length}개</span>
        </div>

        <div className='grid grid-cols-3 gap-8 md:grid-cols-4'>
          {images.map((imageUrl, index) => {
            const isSelected = imageUrl === selectedImage

            return (
              <button
                key={imageUrl}
                type='button'
                className='w-full text-left'
                disabled={!isGalleryOpen}
                aria-pressed={isSelected}
                aria-label={isSelected ? `선택된 배경 ${index + 1}` : `배경 ${index + 1} 선택`}
                onClick={() => {
                  onChange(imageUrl)
                  if (autoCollapseOnSelect) setGalleryOpen(false)
                }}>
                <div
                  className={clsx(
                    'relative aspect-[16/9] w-full overflow-hidden rounded-8 border bg-gray-lighten active-press-duration active:scale-95',
                    isSelected ? 'border-primary ring-1 ring-primary/60' : 'border-gray',
                  )}>
                  <Image
                    className='object-cover'
                    src={imageUrl}
                    alt={`배경 ${index + 1}`}
                    fill
                    sizes='(max-width: 768px) 33vw, 25vw'
                  />
                  {isSelected && (
                    <span className='absolute right-6 top-6 flex size-24 items-center justify-center rounded-8 border border-white/70 bg-white/85 text-primary shadow-[0_2px_8px_rgba(0,0,0,0.14)] backdrop-blur-md'>
                      <CircleCheckIcon size={16} color={colors.primary.DEFAULT} />
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ThumbnailGlassButton({
  ariaLabel,
  onClick,
  children,
}: {
  ariaLabel: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type='button'
      className='group size-40 rounded-8 active-press-duration active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
      onClick={onClick}
      aria-label={ariaLabel}>
      <GlassSurface
        width={40}
        height={40}
        borderRadius={8}
        borderWidth={0.16}
        backgroundOpacity={0.15}
        distortionScale={-100}
        displace={1}
        greenOffset={4}
        blueOffset={8}
        saturation={1.5}
        blur={4}
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.36)',
        }}>
        <div className='absolute inset-0 bg-black-darken/15 group-active:bg-gray/20' />
        <span className='relative z-10 flex items-center justify-center'>{children}</span>
      </GlassSurface>
    </button>
  )
}
