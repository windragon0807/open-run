import { Metadata } from 'next'
import ManageMembers from '@components/bung/ManageMembers'

export default function Page({ searchParams }: { searchParams: { memberList: string } }) {
  const memberList = JSON.parse(searchParams.memberList)
  return <ManageMembers memberList={memberList} />
}

export const metadata: Metadata = {
  title: '멤버 관리',
}
