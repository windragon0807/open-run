import Image from 'next/image'
import { WearingAvatar } from '@type/avatar'

export default function AvatarCloset({ selectedAvatar }: { selectedAvatar: WearingAvatar }) {
  return (
    <section className='z-10 w-full bg-white px-16 shadow-floating-primary'>
      <div className='relative mb-16 flex h-248 w-full justify-center rounded-16 bg-black-darken'>
        {/** 오픈런 아이콘 */}
        <svg
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          width={160}
          height={160}
          viewBox='0 0 160 160'>
          <g opacity={0.1}>
            <path
              className='fill-white'
              d='M98.5714 133.333H0L7.30159 97.7771H98.5714C108.653 97.7771 116.825 89.8177 116.825 79.9993C116.825 70.181 108.653 62.2216 98.5714 62.2216H62.0635C51.9821 62.2216 43.8095 70.181 43.8095 79.9993C43.8095 81.217 43.9352 82.4061 44.1747 83.5549H7.42135C7.34193 82.3797 7.30159 81.1941 7.30159 79.9993C7.30159 50.5442 31.8193 26.666 62.0635 26.666H98.5714C128.816 26.666 153.333 50.5442 153.333 79.9993C153.333 109.455 128.816 133.333 98.5714 133.333Z'
            />
          </g>
        </svg>

        {/** 아바타 이미지 */}
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

        {/** 랜덤 버튼 */}
        <button className='absolute bottom-8 right-8 flex aspect-square w-[40px] items-center justify-center rounded-full bg-white'>
          <svg width={24} height={24} viewBox='0 0 24 24'>
            <path
              className='fill-black-darken'
              d='M11 20.45C8.98333 20.2 7.3125 19.3208 5.9875 17.8125C4.6625 16.3042 4 14.5333 4 12.5C4 11.4 4.21667 10.3458 4.65 9.3375C5.08333 8.32917 5.7 7.45 6.5 6.7L7.925 8.125C7.29167 8.69167 6.8125 9.35 6.4875 10.1C6.1625 10.85 6 11.65 6 12.5C6 13.9667 6.46667 15.2625 7.4 16.3875C8.33333 17.5125 9.53333 18.2 11 18.45V20.45ZM13 20.45V18.45C14.45 18.1833 15.6458 17.4917 16.5875 16.375C17.5292 15.2583 18 13.9667 18 12.5C18 10.8333 17.4167 9.41667 16.25 8.25C15.0833 7.08333 13.6667 6.5 12 6.5H11.925L13.025 7.6L11.625 9L8.125 5.5L11.625 2L13.025 3.4L11.925 4.5H12C14.2333 4.5 16.125 5.275 17.675 6.825C19.225 8.375 20 10.2667 20 12.5C20 14.5167 19.3375 16.2792 18.0125 17.7875C16.6875 19.2958 15.0167 20.1833 13 20.45Z'
            />
          </svg>
        </button>
      </div>
    </section>
  )
}

function Parts({ src, alt }: { src: string; alt: string }) {
  return <Image className='object-contain' src={src} alt={alt} priority fill sizes='(max-width: 768px) 100vw, 33vw' />
}
