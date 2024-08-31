import Link from 'next/link'
import Spacing from '@shared/Spacing'
import { fetchBungs } from '@apis/bungs/fetchBungs/api'
import CreateBungButton from './CreateBungButton'
import BungCard from './BungCard'

export default async function MyBungs() {
  // const data = await fetchBungs({
  //   status: 'ALL',
  //   page: 0,
  //   limit: 10,
  // })
  return (
    <section className='px-16 flex flex-col'>
      <div className='flex justify-between items-ceter w-full max-w-[500px] mx-auto'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black dark:text-white'>
          참여 예정
        </span>
        <span className='text-[12px] leading-[16px] tracking-[-0.24px] text-black dark:text-white'>
          아직 일정이 없어요
        </span>
      </div>
      <Spacing size={8} />
      <Link href='/bung/asdfasdf'>
        <BungCard
          place='서울 마포구 공덕동'
          time={new Date(2024, 8, 28, 19, 0, 0)}
          distance={6}
          pace={`5' 41"`}
          isBungMaster
        />
      </Link>
      <Spacing size={8} />
      <CreateBungButton>벙 만들기</CreateBungButton>
    </section>
  )
}
