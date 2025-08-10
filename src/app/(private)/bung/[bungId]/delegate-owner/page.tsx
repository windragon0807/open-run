import { Metadata } from 'next'
import DelegateOwner from '@components/bung/DelegateOwner'

export default function Page({ searchParams }: { searchParams: { memberList: string } }) {
  const memberList = JSON.parse(searchParams.memberList)
  return <DelegateOwner memberList={memberList} />
}

export const metadata: Metadata = {
  title: '벙주 넘기기',
}
