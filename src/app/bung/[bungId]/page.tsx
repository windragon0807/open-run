import { ko } from 'date-fns/locale'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'

import { convertStringTimeToDate } from '@utils/time'
import Spacing from '@shared/Spacing'
import Layout from '@shared/Layout'
import RunnerIcon from '@icons/RunnerIcon'
import PlaceIcon from '@icons/PlaceIcon'
import CalendarIcon from '@icons/CalendarIcon'
import BackIcon from '@icons/BackIcon'
import NaverMap from '@components/bung/NaverMap'
import BungCompleteButton from '@components/bung/BungCompleteButton'
import { fetchBungDetail } from '@apis/bungs/fetchBungDetails/api'

type Props = {
  params: {
    bungId: string
  }
}

const mock = [
  { imageSrc: '/temp/nft_detail_1.png', name: '참여자 1' },
  { imageSrc: '/temp/nft_detail_2.png', name: '참여자 2' },
  { imageSrc: '/temp/nft_detail_4.png', name: '참여자 3' },
  { imageSrc: '/temp/nft_detail_1.png', name: '참여자 4' },
  { imageSrc: '/temp/nft_detail_2.png', name: '참여자 5' },
  { imageSrc: '/temp/nft_detail_4.png', name: '참여자 6' },
]

export default async function Page({ params: { bungId } }: Props) {
  const { data } = await fetchBungDetail({ bungId })
  const formattedDate = format(convertStringTimeToDate(data.startDateTime), 'M월 d일 (E) a h:mm', { locale: ko })

  return (
    <Layout className='relative'>
      <header className='absolute top-16 left-8 flex justify-between items-center'>
        <Link href='/'>
          <BackIcon color='white' />
        </Link>
      </header>
      <div className='w-full h-200 bg-[url("/temp/img_thumbnail_1.png")] bg-cover' />
      <section className='w-full h-[calc(100%-185px)] bg-gradient-main bg-cover transform -translate-y-15 rounded-[8px_8px_0_0] overflow-y-auto'>
        <div className='px-16'>
          <Spacing size={24} />
          <span className='text-[28px] leading-[36px] tracking-[-0.56px] font-bold text-white'>{data.name}</span>
          <Spacing size={16} />
          <div className='flex gap-6 items-center'>
            <PlaceIcon />
            <span className='text-[14px] leading-[20px] tracking-[-0.28px] text-white'>{data.location}</span>
          </div>
          <Spacing size={2} />
          <div className='flex gap-6 items-center'>
            <CalendarIcon />
            <span className='text-[14px] leading-[20px] tracking-[-0.28px] text-white'>{formattedDate}</span>
          </div>
          <Spacing size={2} />
          <div className='flex gap-6 items-center'>
            <RunnerIcon />
            <span className='text-[14px] leading-[20px] tracking-[-0.28px] text-white'>{`${data.distance} km ${data.pace}`}</span>
          </div>
          <Spacing size={24} />
          <BungCompleteButton />
        </div>
        <Spacing size={56} />
        <div className='flex flex-col gap-8'>
          <span className='text-[16px] leading-[24px] tracking-[-0.32px] font-bold text-white px-16'>참여자 7명</span>
          <div className='flex gap-8 overflow-x-auto px-16 pb-20'>
            <div className='flex flex-col gap-6 items-center'>
              <div className='relative w-76 aspect-[1] bg-black rounded-8'>
                <Image src='/temp/nft_detail_3.png' alt='' fill sizes='100%' />
              </div>
              <div className='flex gap-4'>
                <span className='text-[12px] leading-[16px] font-bold text-white'>닉네임</span>
                <Image src='/images/icon_crown_white.png' alt='' width={16} height={16} />
              </div>
            </div>
            {mock.map((item, index) => (
              <div key={`${item.imageSrc}-${index}`} className='flex flex-col gap-6 items-center'>
                <div className='relative w-76 aspect-[1] bg-black rounded-8'>
                  <Image src={item.imageSrc} alt='' fill sizes='100%' />
                </div>
                <span className='text-[12px] leading-[16px] font-bold text-white'>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <Spacing size={20} />
        <span className='text-[14px] leading-[20px] tracking-[-0.28px] text-white px-16'>{data.location}</span>
        <Spacing size={10} />
        <div className='px-16'>
          <NaverMap />
        </div>
        <Spacing size={30} />
      </section>
    </Layout>
  )
}
