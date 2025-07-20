import { Metadata } from 'next'
import ManageMembers from '@components/bung/ManageMembers'
import Layout from '@shared/Layout'

export default function Page({ searchParams }: { searchParams: { memberList: string } }) {
  const memberList = JSON.parse(searchParams.memberList)
  return (
    <Layout>
      <ManageMembers memberList={memberList} />
    </Layout>
  )
}

export const metadata: Metadata = {
  title: '멤버 관리',
}
