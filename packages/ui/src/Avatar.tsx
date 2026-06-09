import Image from 'next/image'
import { forwardRef, memo } from 'react'
import { Avatar as AvatarItem, WearingAvatar } from '@openrun/types'

type Props = WearingAvatar & {
  className?: string
  sizes?: string
}

const Avatar = forwardRef<HTMLDivElement, Props>(function Avatar(
  {
    className,
    sizes = '(max-width: 768px) 100vw, 33vw',
    hair,
    fullSet,
    upperClothing,
    lowerClothing,
    footwear,
    face,
    skin,
    accessories,
  },
  ref,
) {
  const hairImageUrls = getImageUrls(hair)
  const skinImageUrl = getPrimaryImageUrl(skin) ?? '/images/avatars/avatar_default_skin.png'
  const faceImageUrl = getPrimaryImageUrl(face) ?? '/images/avatars/avatar_default_face.png'
  const headAccessoryImageUrl = getPrimaryImageUrl(accessories['head-accessories'])
  const eyeAccessoryImageUrl = getPrimaryImageUrl(accessories['eye-accessories'])
  const earAccessoryImageUrl = getPrimaryImageUrl(accessories['ear-accessories'])
  const footwearImageUrl = getPrimaryImageUrl(footwear)
  const lowerClothingImageUrl = getPrimaryImageUrl(lowerClothing)
  const upperClothingImageUrl = getPrimaryImageUrl(upperClothing)
  const bodyAccessoryImageUrl = getPrimaryImageUrl(accessories['body-accessories'])

  return (
    <div ref={ref} className={className}>
      {hairImageUrls[1] && <Parts src={hairImageUrls[1]} alt='뒷머리' sizes={sizes} />}
      <Parts src={skinImageUrl} alt='피부' sizes={sizes} />
      <Parts src='/images/avatars/avatar_default_body.png' alt='아바타' sizes={sizes} />
      {hairImageUrls[0] && <Parts src={hairImageUrls[0]} alt='앞머리' sizes={sizes} />}
      <Parts src={faceImageUrl} alt='얼굴' sizes={sizes} />
      {headAccessoryImageUrl && <Parts src={headAccessoryImageUrl} alt='머리 악세서리' sizes={sizes} />}
      {eyeAccessoryImageUrl && <Parts src={eyeAccessoryImageUrl} alt='눈 악세서리' sizes={sizes} />}
      {earAccessoryImageUrl && <Parts src={earAccessoryImageUrl} alt='귀 악세서리' sizes={sizes} />}
      {footwearImageUrl && <Parts src={footwearImageUrl} alt='신발' sizes={sizes} />}
      {lowerClothingImageUrl && <Parts src={lowerClothingImageUrl} alt='하의' sizes={sizes} />}
      {upperClothingImageUrl && <Parts src={upperClothingImageUrl} alt='상의' sizes={sizes} />}
      {bodyAccessoryImageUrl && <Parts src={bodyAccessoryImageUrl} alt='몸 악세서리' sizes={sizes} />}
    </div>
  )
})

export default memo(Avatar)

function Parts({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return <Image className='object-contain' src={src} alt={alt} priority fill sizes={sizes} />
}

function getPrimaryImageUrl(avatar: AvatarItem | null): string | null {
  return getImageUrls(avatar)[0] ?? null
}

function getImageUrls(avatar: AvatarItem | null): string[] {
  if (avatar == null) return []
  if (Array.isArray(avatar.imageUrl)) {
    return avatar.imageUrl.filter((imageUrl) => imageUrl != null && imageUrl !== '')
  }
  return avatar.imageUrl ? [avatar.imageUrl] : []
}
