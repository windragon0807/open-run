import Spacing from '@shared/Spacing'
import CreateBungButton from './CreateBungButton'
import BungCard from './BungCard'

export default function MyBungs() {
  return (
    <section className='px-16 flex flex-col'>
      <div className='flex justify-between items-center w-full max-w-[500px] mx-auto'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black dark:text-white'>
          참여 예정
        </span>
        <span className='text-[12px] leading-[16px] tracking-[-0.24px] text-black dark:text-white'>
          아직 일정이 없어요
        </span>
      </div>
      <Spacing size={8} />
      <BungCard
        place='서울 마포구 공덕동'
        time={new Date(2024, 8, 28, 19, 0, 0)}
        distance={6}
        pace={`5\' 41"`}
        isBungMaster
      />
      <Spacing size={8} />
      <CreateBungButton>벙 만들기</CreateBungButton>
    </section>
  )
}
