import Spacing from '@shared/Spacing'
import PlusIcon from '@components/icons/PlusIcon'
import BungCard from './BungCard'

export default function MyBungs() {
  return (
    <section className='px-16 flex flex-col'>
      <div className='flex justify-between items-center w-full max-w-[500px] mx-auto'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black'>참여 예정</span>
        <span className='text-[12px] leading-[16px] tracking-[-0.24px] text-black'>아직 일정이 없어요</span>
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
      <button className='w-full max-w-[500px] mx-auto rounded-8 border border-dashed border-black py-12 flex gap-8 justify-center items-center'>
        벙 만들기
        <PlusIcon />
      </button>
    </section>
  )
}
