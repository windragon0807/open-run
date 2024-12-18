import Image from 'next/image'
import { WearingAvatar } from '@/types/avatar'

export default function AvatarCloset({ selectedAvatar }: { selectedAvatar: WearingAvatar }) {
  return (
    <section className='w-full px-16 shadow-custom-white bg-white z-10'>
      <div className='relative w-full h-248 bg-black-darken rounded-16 mb-16 flex justify-center'>
        {selectedAvatar.background && (
          <Image
            className='absolute top-16'
            src={selectedAvatar.background.imageUrl as string}
            alt='Avatar Background'
            width={216}
            height={216}
          />
        )}
        <div className='absolute top-16 w-216 h-270 flex-shrink-0'>
          {selectedAvatar.hair && <Parts src={selectedAvatar.hair.imageUrl[1]} alt='뒷머리' />}
          {selectedAvatar.skin && <Parts src={selectedAvatar.skin.imageUrl as string} alt='피부' />}
          <Parts src='/temp/avatar/nft_body.png' alt='아바타' />
          {selectedAvatar.hair && <Parts src={selectedAvatar.hair.imageUrl[0]} alt='앞머리' />}
          {selectedAvatar.face && <Parts src={selectedAvatar.face.imageUrl as string} alt='얼굴' />}
          {selectedAvatar.accessories['head-accessories'] && (
            <Parts src={selectedAvatar.accessories['head-accessories'].imageUrl as string} alt='머리 악세서리' />
          )}
          {selectedAvatar.accessories['ear-accessories'] && (
            <Parts src={selectedAvatar.accessories['ear-accessories'].imageUrl as string} alt='귀 악세서리' />
          )}
          {selectedAvatar.footwear && <Parts src={selectedAvatar.footwear.imageUrl as string} alt='신발' />}
          {selectedAvatar.lowerClothing && <Parts src={selectedAvatar.lowerClothing.imageUrl as string} alt='하의' />}
          {selectedAvatar.upperClothing && <Parts src={selectedAvatar.upperClothing.imageUrl as string} alt='상의' />}
          {selectedAvatar.accessories['body-accessories'] && (
            <Parts src={selectedAvatar.accessories['body-accessories'].imageUrl as string} alt='몸 악세서리' />
          )}
        </div>
      </div>
    </section>
  )
}

function Parts({ src, alt }: { src: string; alt: string }) {
  return <Image className='object-contain' src={src} alt={alt} priority fill sizes='(max-width: 768px) 100vw, 33vw' />
}
