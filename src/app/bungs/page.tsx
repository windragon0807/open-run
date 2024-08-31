'use client'

import { useQuery } from 'react-query'

import Layout from '@shared/Layout'
import CreateBungButton from '@components/temp/CreateBungButton'

// import { searchByNickname } from '@apis/users/searchByNickname/api'
import { fetchBungs } from '@apis/bungs/fetchBungs/api'

export default function Page() {
  // WARNING CORS
  // const { data } = useQuery({
  //   queryKey: ['/v1/users/{nickname}'],
  //   queryFn: () => searchByNickname({ nickname: 'Ryong' }),
  // })

  // WARNING CORS
  // const fetchBungsQuery = { isParticipating: false, pageable: { page: 0, size: 1, sort: [''] } }
  // const { data } = useQuery({
  //   queryKey: ['/v1/bungs', fetchBungsQuery],
  //   queryFn: () => fetchBungs(fetchBungsQuery),
  // })
  // console.log('ryong', data)

  return (
    <Layout>
      <section className='w-full h-full flex flex-col items-center justify-center'>
        <CreateBungButton />
      </section>
    </Layout>
  )
}
