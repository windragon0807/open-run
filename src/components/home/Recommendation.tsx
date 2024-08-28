import Spacing from '@shared/Spacing'
import ArrowRight from '@components/icons/ArrowRight'
import RecommendationCard from './RecommendationCard'

export default function Recommendation() {
  return (
    <section className='px-16 flex flex-col'>
      <button className='flex justify-between items-center w-full max-w-[500px] mx-auto'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black'>추천</span>
        <ArrowRight />
      </button>
      <Spacing size={8} />
      <RecommendationCard
        title='타이틀이 여기 들어갑니다.'
        place='서울시 강남구'
        time={new Date(2024, 8, 12, 19, 0, 0)}
        tags={['해시태크', '런', '마포구']}
      />
    </section>
  )
}
