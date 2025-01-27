'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import Spacing from '@shared/Spacing'
import { useMyBungs } from '@apis/bungs/fetchMyBungs/query'
import CreateBungButton from './CreateBungButton'
import BungCard from './BungCard'

export default function MyBungs() {
  /* 실시간 타이머를 포함하고 있는 컴포넌트는 클라이언트 컴포넌트로 렌더링해야 합니다. */
  const { data } = useMyBungs({
    isOwned: null,
    status: null,
    page: 0,
    limit: 10,
  })

  return (
    <section className='px-16 flex flex-col'>
      <div className='flex justify-between w-full max-w-[500px] mx-auto'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black-default'>참여 예정</span>
        {data == null || data.data.length === 0 ? (
          <span className='text-[12px] leading-[16px] tracking-[-0.24px] text-black-default place-content-center'>
            아직 일정이 없어요
          </span>
        ) : null}
      </div>
      <Spacing size={8} />
      {data?.data.map((item, index) => (
        <Fragment key={index}>
          <Link key={index} href={`/bung/${item.bungId}`}>
            <BungCard
              place={item.location}
              time={new Date(item.startDateTime)}
              distance={item.distance}
              pace={item.pace}
              isBungOwner={item.hasOwnership}
              title={item.name}
            />
          </Link>
          <Spacing size={8} />
        </Fragment>
      ))}
      <Spacing size={8} />
      <CreateBungButton>벙 만들기</CreateBungButton>
    </section>
  )
}
