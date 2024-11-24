'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ko } from 'date-fns/locale'
import { format } from 'date-fns'

import Layout from '@shared/Layout'
import Spacing from '@shared/Spacing'
import NaverMap from '@components/bung/NaverMap'
import ParticipateButton from '@components/bung/ParticipateButton'
import Certification from '@components/bung/Certification'
import BackIcon from '@icons/BackIcon'
import PlaceIcon from '@icons/PlaceIcon'
import CalendarIcon from '@icons/CalendarIcon'
import RunnerIcon from '@icons/RunnerIcon'
import PersonIcon from '@icons/PersonIcon'
import { BungDetail } from '@models/bung'
import { convertStringTimeToDate } from '@utils/time'

const mock = [
  { imageSrc: '/temp/nft_detail_1.png', name: '참여자 1' },
  { imageSrc: '/temp/nft_detail_2.png', name: '참여자 2' },
  { imageSrc: '/temp/nft_detail_4.png', name: '참여자 3' },
  { imageSrc: '/temp/nft_detail_1.png', name: '참여자 4' },
  { imageSrc: '/temp/nft_detail_2.png', name: '참여자 5' },
  { imageSrc: '/temp/nft_detail_4.png', name: '참여자 6' },
]

export default function BungDetails({ details, isParticipated }: { details: BungDetail; isParticipated: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    container: containerRef,
  })

  const handleScrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const translateY = useTransform(scrollY, [0, 200], [-15, isParticipated ? -108 : -140])

  return (
    <Layout className='relative'>
      <header className='absolute w-full h-60 px-16 flex justify-between items-center' onClick={handleScrollToTop}>
        <Link href='/' onClick={(e) => e.stopPropagation()}>
          <BackIcon size={24} color='white' />
        </Link>
        {isParticipated && <button className='text-white text-14'>참여 취소</button>}
      </header>
      <div className='w-full h-200 bg-[url("/temp/img_thumbnail_1.png")] bg-cover cursor-pointer' />

      <motion.section
        style={{ y: translateY }}
        className='relative w-full h-full bg-gray-lighten bg-cover rounded-[8px_8px_0_0]'>
        {isParticipated && (
          <div className='absolute -top-32 -z-[1] w-full h-40 px-16 flex justify-between bg-[#F06595] bg-opacity-60 rounded-[8px_8px_0_0]'>
            <span className='relative italic text-14 font-bold text-white top-6'>00 : 09 : 32 : 56</span>
            <span className='relative text-14 text-white top-6'>시작까지 남은 시간</span>
          </div>
        )}

        <section
          ref={containerRef}
          className='overflow-y-auto rounded-[8px_8px_0_0] bg-gray-lighten'
          style={{ height: isParticipated ? 'calc(100% - 80px)' : 'calc(100% - 50px)' }}>
          <div className='p-16 bg-white shadow-shadow_white rounded-8'>
            <span className='text-xl font-bold text-black'>{details.name}</span>
            <Spacing size={16} />
            <div className='flex gap-8 items-center'>
              <PlaceIcon color='var(--black)' />
              <span className='text-sm text-black'>{details.location}</span>
            </div>
            <Spacing size={8} />
            <div className='flex gap-8 items-center'>
              <CalendarIcon color='var(--black)' />
              <span className='text-sm text-black'>
                {format(convertStringTimeToDate(details.startDateTime), 'M월 d일 (E) a h:mm', { locale: ko })}
              </span>
            </div>
            <Spacing size={8} />
            <div className='flex gap-8 items-center'>
              <RunnerIcon color='var(--black)' />
              <span className='text-sm text-black'>{`${details.distance} km ${details.pace}`}</span>
            </div>
            <Spacing size={8} />
            <div className='flex gap-8 items-center'>
              <PersonIcon color='var(--black)' />
              <div className='flex gap-4 items-center'>
                <span className='text-sm text-black'>{`${details.memberNumber} / ${details.memberList.length}`}</span>
                <span className='px-4 py-2 bg-pink-transparent rounded-4 text-12 font-bold text-pink'>{`${details.memberList.length - details.memberNumber}자리 남았어요`}</span>
              </div>
            </div>
            <Spacing size={24} />
            {isParticipated ? <Certification /> : <ParticipateButton />}
          </div>
          <Spacing size={24} />

          <div className='flex flex-col gap-8'>
            <span className='text-base font-bold text-black-darken px-16'>
              {details.memberNumber}명이 함께 뛸 예정이에요
            </span>
            <div className='flex gap-8 overflow-x-auto px-16'>
              <div className='flex flex-col gap-6 items-center'>
                <div className='relative w-76 aspect-[1] bg-black rounded-8'>
                  <Image src='/temp/nft_detail_3.png' alt='' fill sizes='100%' />
                </div>
                <div className='flex gap-4 items-center'>
                  <span className='text-12 font-bold text-black-darken'>벙주</span>
                  <Image src='/images/icon_crown.png' alt='Crown Icon' width={16} height={18} />
                </div>
              </div>
              {mock.map((item, index) => (
                <div key={`${item.imageSrc}-${index}`} className='flex flex-col gap-6 items-center'>
                  <div className='relative w-76 aspect-[1] bg-black rounded-8'>
                    <Image src={item.imageSrc} alt='' fill sizes='100%' />
                  </div>
                  <span className='text-12 font-bold text-black-darken'>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <Spacing size={24} />
          <p className='w-full px-16 text-sm text-black-darken'>
            벙 설명이 들어갈 공간입니다. 벙 설명이 들어갈 공간입니다. 벙 설명이 들어갈 공간입니다. 벙 설명이 들어갈
            공간입니다.
          </p>
          <Spacing size={24} />
          <h3 className='text-sm text-black-darken font-bold pl-16'>뒷풀이</h3>
          <Spacing size={4} />
          <p className='text-sm text-black-darken pl-16'>뒷풀이 정보가 들어갑니다. (유/무, 장소(카페, 식사) 등)</p>
          <Spacing size={40} />
          <div className='flex items-center gap-4 pl-16'>
            <PlaceIcon color='var(--black)' />
            <span className='text-sm text-black-darken font-bold'>{details.location}</span>
          </div>
          <Spacing size={8} />
          <div className='px-16'>
            <NaverMap />
          </div>
          <Spacing size={18} />
          <div className='flex flex-wrap gap-8 px-16'>
            {details.hashtags.map((label) => (
              <HashTag key={label} label={label} />
            ))}
          </div>
          <Spacing size={40} />
        </section>
      </motion.section>
    </Layout>
  )
}

function HashTag({ label }: { label: string }) {
  return (
    <div className='flex w-fit items-center gap-8 px-8 py-4 bg-black-darken rounded-4'>
      <span className='text-white text-14'>{label}</span>
    </div>
  )
}
