import Image from 'next/image'
import { forwardRef, memo } from 'react'
import { WearingAvatar } from '@type/avatar'

type Props = WearingAvatar & {
  className?: string
}

const Avatar = forwardRef<HTMLDivElement, Props>(function Avatar(
  { className, hair, fullSet, upperClothing, lowerClothing, footwear, face, skin, accessories },
  ref,
) {
  return (
    <div ref={ref} className={className}>
      {hair && <Parts src={hair.imageUrl[1]} alt='뒷머리' />}
      <Parts src={(skin?.imageUrl as string) ?? '/images/avatars/avatar_default_skin.png'} alt='피부' />
      <Parts src='/images/avatars/avatar_default_body.png' alt='아바타' />
      {hair && <Parts src={hair.imageUrl[0]} alt='앞머리' />}
      <Parts src={(face?.imageUrl as string) ?? '/images/avatars/avatar_default_face.png'} alt='얼굴' />
      {accessories['head-accessories'] && (
        <Parts src={accessories['head-accessories'].imageUrl as string} alt='머리 악세서리' />
      )}
      {accessories['ear-accessories'] && (
        <Parts src={accessories['ear-accessories'].imageUrl as string} alt='귀 악세서리' />
      )}
      {footwear && <Parts src={footwear.imageUrl as string} alt='신발' />}
      {lowerClothing && <Parts src={lowerClothing.imageUrl as string} alt='하의' />}
      {upperClothing && <Parts src={upperClothing.imageUrl as string} alt='상의' />}
      {accessories['body-accessories'] && (
        <Parts src={accessories['body-accessories'].imageUrl as string} alt='몸 악세서리' />
      )}
    </div>
  )
})

export default memo(Avatar)

function Parts({ src, alt }: { src: string; alt: string }) {
  return <Image className='object-contain' src={src} alt={alt} priority fill sizes='(max-width: 768px) 100vw, 33vw' />
}
