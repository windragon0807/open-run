import Image from 'next/image'

import Spacing from '@shared/Spacing'
import Layout from '@shared/Layout'
import RunnerIcon from '@components/icons/RunnerIcon'
import PlaceIcon from '@components/icons/PlaceIcon'
import CalendarIcon from '@components/icons/CalendarIcon'
import NaverMap from '@components/bung/NaverMap'

type Props = {
  params: {
    bungId: string
  }
}

const mock = [
  { imageSrc: '/temp/nft_detail_1.png', name: '참여자 1' },
  { imageSrc: '/temp/nft_detail_2.png', name: '참여자 2' },
  { imageSrc: '/temp/nft_detail_3.png', name: '참여자 3' },
  { imageSrc: '/temp/nft_detail_4.png', name: '참여자 4' },
]

export default function Page({ params: { bungId } }: Props) {
  // TODO: bungId를 통해 상세 정보 가져오기
  return (
    <Layout className='relative'>
      <div className='w-full h-200 bg-[url("/temp/img_thumbnail_1.png")] bg-cover' />
      <section className='w-full h-[calc(100%-185px)] bg-[url("/images/bg_home_gradient.png")] bg-cover transform -translate-y-15 rounded-[8px_8px_0_0] overflow-y-auto'>
        <div className='px-16'>
          <Spacing size={24} />
          <span className='text-[28px] leading-[36px] tracking-[-0.56px] font-bold text-white'>
            Title이 들어갑니다.
          </span>
          <Spacing size={16} />
          <div className='flex gap-6 items-center'>
            <PlaceIcon />
            <span className='text-[14px] leading-[20px] tracking-[-0.28px] text-white'>서울 마포구 공덕동</span>
          </div>
          <Spacing size={2} />
          <div className='flex gap-6 items-center'>
            <CalendarIcon />
            <span className='text-[14px] leading-[20px] tracking-[-0.28px] text-white'>6/11 (화) 오후 7:00</span>
          </div>
          <Spacing size={2} />
          <div className='flex gap-6 items-center'>
            <RunnerIcon />
            <span className='text-[14px] leading-[20px] tracking-[-0.28px] text-white'>{`6km 5'41"`}</span>
          </div>
          <Spacing size={24} />
          <button className='w-full h-56 rounded-8 bg-secondary flex items-center justify-center'>
            <span className='text-[16px] text-black font-bold'>참여 완료</span>
          </button>
        </div>
        <Spacing size={56} />
        <div className='flex flex-col gap-8'>
          <span className='text-[16px] leading-[24px] tracking-[-0.32px] font-bold text-white px-16'>참여자 10명</span>
          <div className='flex gap-8 overflow-x-auto px-16 pb-20'>
            <div className='flex flex-col gap-6 items-center'>
              <div className='w-76 aspect-[1] bg-black rounded-8'>{/* 유저의 아바타가 들어갑니다. */}</div>
              <div className='flex gap-4'>
                <span className='text-[12px] leading-[16px] font-bold text-white'>닉네임</span>
                <Image src='/images/icon_crown_white.png' alt='' width={16} height={16} />
              </div>
            </div>
            {mock.map((item) => (
              <div key={item.imageSrc} className='flex flex-col gap-6 items-center'>
                <div className='relative w-76 aspect-[1] bg-black rounded-8'>
                  <Image src={item.imageSrc} alt='' fill sizes='100%' />
                </div>
                <span className='text-[12px] leading-[16px] font-bold text-white'>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <Spacing size={20} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px] text-white px-16'>
          서울특별시 성동구 서울숲길53
        </span>
        <Spacing size={10} />
        <div className='px-16'>
          <NaverMap />
        </div>
        <Spacing size={30} />
      </section>
    </Layout>
  )
}
