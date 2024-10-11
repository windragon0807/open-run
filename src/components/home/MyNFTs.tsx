import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import addDelimiter from '@utils/addDelimiter'
import Spacing from '@shared/Spacing'

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
      <div className='w-184 h-230 relative'>
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

      <div className='flex flex-col w-[calc(100%-184px)]'>
        <Spacing size={8} />

        {/* dark 모드일 때, bg-white 선언 시, dark 모드 색상 적용이 안 됨 */}
        <div className='w-full dark:bg-gradient-black shadow-shadow_white dark:shadow-[unset] flex flex-col py-16'>
          <span className='text-[14px] leading-[20px] tracking-[-0.28px] font-bold pl-16 dark:text-white'>
            최근 획득한 NFT
          </span>
          <Spacing size={2} />
          <ul className='w-full flex overflow-x-auto gap-2 px-16 pb-12'>
            {nftImageList.map((src, index) => (
              <NFTBox key={index}>
                <Image src={src} alt={`NFT_${src}`} width={36} height={36} />
              </NFTBox>
            ))}
          </ul>
          <span className='text-[14px] leading-[20px] tracking-[-0.28px] font-bold pl-16 dark:text-white'>
            다음 NFT 획득까지
          </span>
          <Spacing size={2} />
          <div className='flex gap-8 px-16'>
            <NFTBox>
              <Image src='/temp/nft_glasses.png' alt='What is your next NFT' width={36} height={36} />
            </NFTBox>
            <div className='w-[calc(100%-46px)] flex flex-col items-center justify-center gap-5'>
              <div className='w-full flex gap-4 items-center'>
                <div className='relative overflow-hidden whitespace-nowrap w-[calc(100%-20px)]'>
                  <span className='animate-marquee inline-block text-[12px] leading-[16px] tracking-[-0.24px] text-black dark:text-white'>
                    벙 참여하여 완료하기
                  </span>
                </div>
                <span className='text-[12px] leading-[16px] tracking-[-0.24px] text-black dark:text-white'>4/10</span>
              </div>
              <ProgressBar progress={40} />
            </div>
          </div>
        </div>

        <Spacing size={16} />

        <Link
          href='/avatar'
          className='self-center shadow-shadow_white dark:shadow-[unset] bg-white dark:bg-black rounded-20 px-20 py-4'>
          <span className='text-[12px] leading-[16px] tracing-[-0.24px] text-black dark:text-white'>아바타 변경</span>
        </Link>
      </div>
    </section>
  )
}

function SkewedLikeLabel({ like }: { like: number }) {
  return (
    <div className='absolute left-8 bottom-8 h-28 bg-secondary rounded-lg transform skew-x-[-10deg] border-2 border-black flex items-center justify-center gap-4 px-8'>
      <Image className='' src='/images/icon_thumbup.png' alt='Thumb Up Icon' width={16} height={16} />
      <span className='text-[16px] font-[900]'>{addDelimiter(like)}</span>
    </div>
  )
}

function NFTBox({ children }: { children: ReactNode }) {
  return (
    <li className='inline-block'>
      <div className='w-40 aspect-[1] rounded-4 border border-gray dark:border-[rgba(255,255,255,0.20)] bg-gray-lighten dark:bg-black flex justify-center items-center'>
        {children}
      </div>
    </li>
  )
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className='w-full h-5 bg-gray overflow-hidden rounded-6'>
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
