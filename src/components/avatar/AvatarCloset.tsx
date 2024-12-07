import Image from 'next/image'
import { WearingAvatar } from '@/types/avatar'

export default function AvatarCloset({ selectedAvatar }: { selectedAvatar: WearingAvatar }) {
  return (
    <section className='w-full px-16 shadow-custom-white bg-white z-10'>
      <div className='relative w-full h-248 bg-black-darken rounded-16 mb-16 flex justify-center'>
        <Image
          className='absolute top-16'
          src='/temp/avatar/avatar_bg.png'
          alt='Avatar Background'
          width={216}
          height={216}
        />
        <div className='absolute top-16 w-216 h-270 flex-shrink-0'>
          {selectedAvatar.skin && <Parts src={selectedAvatar.skin.imageUrl} alt='피부' />}
          <Parts src='/temp/avatar/nft_body.png' alt='아바타' />
          {selectedAvatar.upperClothing && <Parts src={selectedAvatar.upperClothing.imageUrl} alt='상의' />}
          {selectedAvatar.lowerClothing && <Parts src={selectedAvatar.lowerClothing.imageUrl} alt='하의' />}
          {selectedAvatar.hair && <Parts src={selectedAvatar.hair.imageUrl} alt='머리' />}
          {selectedAvatar.accessories['ear-accessories'] && (
            <Parts src={selectedAvatar.accessories['ear-accessories'].imageUrl} alt='귀 악세서리' />
          )}
          {selectedAvatar.face && <Parts src={selectedAvatar.face.imageUrl} alt='얼굴' />}
          {selectedAvatar.accessories['hair-accessories'] && (
            <Parts src={selectedAvatar.accessories['hair-accessories'].imageUrl} alt='머리 악세서리' />
          )}
          {selectedAvatar.accessories['body-accessories'] && (
            <Parts src={selectedAvatar.accessories['body-accessories'].imageUrl} alt='몸 악세서리' />
          )}
          {selectedAvatar.footwear && <Parts src={selectedAvatar.footwear.imageUrl} alt='신발' />}
        </div>
      </div>
    </section>
  )
}

function Parts({ src, alt }: { src: string; alt: string }) {
  return <Image className='object-contain' src={src} alt={alt} priority fill sizes='(max-width: 768px) 100vw, 33vw' />
}
