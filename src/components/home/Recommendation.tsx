import Link from 'next/link'

import { convertStringTimeToDate } from '@utils/time'
import Spacing from '@shared/Spacing'
import { fetchBungs } from '@apis/bungs/fetchBungs/api'
import RecommendationCard from './RecommendationCard'

export default async function Recommendation() {
  const { data: recommendationList } = await fetchBungs({
    isAvailableOnly: true,
    page: 0,
    limit: 10,
  })

  return (
    <section className='px-16 flex flex-col'>
      <div className='flex justify-between items-center w-full max-w-[500px] mx-auto'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black-default dark:text-white'>
          추천
        </span>
      </div>
      <section className='flex flex-col gap-8'>
        {recommendationList?.map((item) => (
          <Link href={`/bung/${item.bungId}`} key={item.bungId}>
            <RecommendationCard
              title={item.name}
              location={item.location}
              time={convertStringTimeToDate(item.startDateTime)}
              hashtags={item.hashtags}
            />
          </Link>
        ))}
      </section>
      <Spacing size={60} />
    </section>
  )
}
