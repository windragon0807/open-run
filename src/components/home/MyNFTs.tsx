import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import Spacing from '@shared/Spacing'
import addDelimiter from '@utils/addDelimiter'

const nftImageList = [
  '/temp/nft_phone.png',
  '/temp/nft_sleeveless.png',
  '/temp/nft_pants.png',
  '/temp/nft_phone.png',
  '/temp/nft_sleeveless.png',
  '/temp/nft_pants.png',
]

export default function MyNFTs() {
  return (
    <section className='flex'>
      <div className='relative h-230 w-184'>
        <Image className='absolute' src='/temp/nft_bg.png' alt='NFT Background' width={184} height={184} />
        <Image
          className='absolute'
          src='/temp/nft_character_lg.png'
          alt='NFT Character'
          width={184}
          height={230}
          priority
        />
        <SkewedLikeLabel like={91} />
      </div>

      <div className='flex w-[calc(100%-184px)] flex-col'>
        <Spacing size={8} />

        <div className='flex w-full flex-col py-16 shadow-floating-primary'>
          <span className='pl-16 text-14 font-bold'>최근 획득한 NFT</span>
          <Spacing size={2} />
          <ul className='scrollbar-hidden flex w-full gap-2 overflow-x-auto px-16 pb-12'>
            {nftImageList.map((src, index) => (
              <NFTBox key={index}>
                <Image src={src} alt={`NFT_${src}`} width={36} height={36} />
              </NFTBox>
            ))}
          </ul>
          <span className='pl-16 text-14 font-bold'>다음 NFT 획득까지</span>
          <Spacing size={2} />
          <div className='flex gap-8 px-16'>
            <NFTBox>
              <Image src='/temp/nft_glasses.png' alt='What is your next NFT' width={36} height={36} />
            </NFTBox>
            <div className='flex w-[calc(100%-46px)] flex-col items-center justify-center gap-5'>
              <div className='flex w-full items-center gap-4'>
                <div className='relative w-[calc(100%-20px)] overflow-hidden whitespace-nowrap'>
                  <span className='inline-block animate-marquee text-12 text-black-default'>벙 참여하여 완료하기</span>
                </div>
                <span className='text-12 text-black-default'>4/10</span>
              </div>
              <ProgressBar progress={40} />
            </div>
          </div>
        </div>

        <Spacing size={16} />

        <Link href='/avatar' className='self-center rounded-20 bg-white px-20 py-4 shadow-floating-primary'>
          <span className='tracing-[-0.24px] text-12 text-black-default'>아바타 변경</span>
        </Link>
      </div>
    </section>
  )
}

function SkewedLikeLabel({ like }: { like: number }) {
  return (
    <div className='absolute bottom-8 left-8 flex h-28 skew-x-[-10deg] transform items-center justify-center gap-4 rounded-lg border-2 border-black-default bg-secondary px-8'>
      <Image className='' src='/images/icon_thumbup.png' alt='Thumb Up Icon' width={16} height={16} />
      <span className='font-jost text-16 font-[900]'>{addDelimiter(like)}</span>
    </div>
  )
}

function NFTBox({ children }: { children: ReactNode }) {
  return (
    <li className='inline-block'>
      <div className='flex aspect-[1] w-40 items-center justify-center rounded-4 border border-gray-default bg-gray-lighten'>
        {children}
      </div>
    </li>
  )
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className='h-5 w-full overflow-hidden rounded-6 bg-gray-default'>
      <div
        className='h-5 bg-primary'
        style={{
          transform: `scaleX(${progress}%)`,
          transition: 'transform 0.3s',
          transformOrigin: 'left',
        }}
      />
    </div>
  )
}
