import { Metadata } from 'next'
import DelegateOwner from '@components/bung/DelegateOwner'
import Layout from '@shared/Layout'

export default function Page({ searchParams }: { searchParams: { memberList: string } }) {
  const memberList = JSON.parse(searchParams.memberList)
  return (
    <Layout>
      <DelegateOwner memberList={memberList} />
    </Layout>
  )
}

export const metadata: Metadata = {
  title: '벙주 넘기기',
}
