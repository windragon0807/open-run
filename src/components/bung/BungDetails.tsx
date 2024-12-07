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
import useTimer from '@hooks/useTimer'
import { convertStringTimeToDate } from '@utils/time'

export default function BungDetails({ details, isParticipated }: { details: BungDetail; isParticipated: boolean }) {
  const 참여인원수 = details.memberList.length

  /* 스크롤이 올라갈수록 컨텐츠 영역이 올라가는 효과를 주기 위한 로직 */
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

  /* 시작까지 남은 시간을 타이머로 표시하기 위한 로직 */
  const { days, hours, minutes, seconds } = useTimer(convertStringTimeToDate(details.startDateTime))
  const formattedTime = `${String(days).padStart(2, '0')} : ${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`

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
            <span className='relative italic text-14 font-bold text-white top-6'>{formattedTime}</span>
            <span className='relative text-14 text-white top-6'>시작까지 남은 시간</span>
          </div>
        )}

        <section
          ref={containerRef}
          className='overflow-y-auto rounded-[8px_8px_0_0] bg-gray-lighten'
          style={{ height: isParticipated ? 'calc(100% - 80px)' : 'calc(100% - 50px)' }}>
          <div className='p-16 bg-white shadow-custom-white rounded-8'>
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
                <span className='text-sm text-black'>{`${참여인원수} / ${details.memberNumber}`}</span>
                <span className='px-4 py-2 bg-pink-transparent rounded-4 text-12 font-bold text-pink'>{`${details.memberNumber - 참여인원수}자리 남았어요`}</span>
              </div>
            </div>
            <Spacing size={24} />
            {isParticipated ? <Certification /> : <ParticipateButton />}
          </div>
          <Spacing size={24} />

          <div className='flex flex-col gap-8'>
            <span className='text-base font-bold text-black-darken px-16'>{참여인원수}명이 함께 뛸 예정이에요</span>
            <div className='flex gap-8 overflow-x-auto px-16'>
              {details.memberList.map((member) => (
                <div key={`${member.nickname}`} className='flex flex-col gap-6 items-center'>
                  <div className='relative w-76 aspect-[1] bg-black rounded-8'>
                    <Image src={'/temp/nft_detail_1.png'} alt='' fill sizes='100%' />
                  </div>
                  <div className='flex gap-4 items-center'>
                    <span className='text-12 font-bold text-black-darken'>{member.nickname}</span>
                    {member.owner && <Image src='/images/icon_crown.png' alt='Crown Icon' width={16} height={18} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Spacing size={24} />
          <p className='w-full px-16 text-sm text-black-darken'>{details.description}</p>
          {details.hasAfterRun && (
            <>
              <Spacing size={24} />
              <h3 className='text-sm text-black-darken font-bold pl-16'>뒷풀이</h3>
              <Spacing size={4} />
              <p className='text-sm text-black-darken pl-16'>{details.afterRunDescription}</p>
            </>
          )}
          <Spacing size={40} />
          <div className='flex items-center gap-4 pl-16'>
            <PlaceIcon color='var(--black)' />
            <span className='text-sm text-black-darken font-bold'>{details.location}</span>
          </div>
          <Spacing size={8} />
          <div className='px-16'>
            <NaverMap location={details.location} />
          </div>
          <Spacing size={18} />
          <div className='flex flex-wrap gap-8 px-16'>
            {details.hashtags.map((label) => (
              <HashTag key={label} label={label} />
            ))}
          </div>
          <Spacing size={80} />
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
