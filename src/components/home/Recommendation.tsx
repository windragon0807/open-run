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
      <div className='flex justify-between items-center w-full max-w-[500px] mx-auto mb-8'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black-default'>추천</span>
      </div>
      <section className='flex flex-col gap-8'>
        {recommendationList?.map((bung) => (
          <Link href={`/bung/${bung.bungId}`} key={bung.bungId}>
            <RecommendationCard
              title={bung.name}
              location={bung.location}
              time={convertStringTimeToDate(bung.startDateTime)}
              remainingCount={bung.memberNumber}
              hashtags={bung.hashtags}
            />
          </Link>
        ))}
      </section>
      <Spacing size={60} />
    </section>
  )
}
