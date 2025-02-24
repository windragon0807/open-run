import Image from 'next/image'
import { WearingAvatar } from '@type/avatar'

export default function AvatarCloset({ selectedAvatar }: { selectedAvatar: WearingAvatar }) {
  return (
    <section className='z-10 w-full bg-white px-16 shadow-floating-primary'>
      <div className='relative mb-16 flex h-248 w-full justify-center rounded-16 bg-black-darken'>
        {selectedAvatar.background && (
          <Image
            className='absolute top-16'
            src={selectedAvatar.background.imageUrl as string}
            alt='Avatar Background'
            width={216}
            height={216}
          />
        )}
        <div className='absolute top-16 h-270 w-216 flex-shrink-0'>
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
