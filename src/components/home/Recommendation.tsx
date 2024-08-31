import { Fragment } from 'react'
import { convertStringTimeToDate } from '@utils/time'
import Spacing from '@shared/Spacing'
import ArrowRight from '@components/icons/ArrowRight'
import { fetchBungs } from '@apis/bungs/fetchBungs/api'
import RecommendationCard from './RecommendationCard'

export default async function Recommendation() {
  const { data } = await fetchBungs({
    status: 'AVAILABLE',
    page: 0,
    limit: 10,
  })

  return (
    <section className='px-16 flex flex-col'>
      <button className='flex justify-between items-center w-full max-w-[500px] mx-auto'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black dark:text-white'>추천</span>
        <ArrowRight />
      </button>
      {data.map((item) => (
        <Fragment key={item.bungId}>
          <Spacing size={8} />
          <RecommendationCard
            title={item.name}
            place={item.location}
            time={convertStringTimeToDate(item.startDateTime)}
            tags={['해시태그', '런', '마포구']}
          />
        </Fragment>
      ))}
      <Spacing size={60} />
    </section>
  )
}
