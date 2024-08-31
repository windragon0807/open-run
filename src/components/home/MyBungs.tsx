import Link from 'next/link'

import { convertStringTimeToDate } from '@utils/time'
import Spacing from '@shared/Spacing'
import { fetchBungs } from '@apis/bungs/fetchBungs/api'
import CreateBungButton from './CreateBungButton'
import BungCard from './BungCard'

export default async function MyBungs() {
  const { data } = await fetchBungs({
    status: 'PENDING',
    page: 0,
    limit: 10,
  })

  return (
    <section className='px-16 flex flex-col'>
      <div className='flex justify-between items-ceter w-full max-w-[500px] mx-auto'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black dark:text-white'>
          참여 예정
        </span>
        {data.length === 0 ? (
          <span className='text-[12px] leading-[16px] tracking-[-0.24px] text-black dark:text-white'>
            아직 일정이 없어요
          </span>
        ) : null}
      </div>
      <Spacing size={8} />
      {data.map((item, index) => (
        <>
          <Link key={index} href={`/bung/${item.bungId}`}>
            <BungCard
              place={item.location}
              time={convertStringTimeToDate(item.startDateTime)}
              distance={item.distance}
              pace={item.pace}
              isBungMaster={item.isOwner === true}
            />
          </Link>
          <Spacing size={8} />
        </>
      ))}
      <Spacing size={8} />
      <CreateBungButton>벙 만들기</CreateBungButton>
    </section>
  )
}
