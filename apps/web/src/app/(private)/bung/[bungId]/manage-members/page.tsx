import { Metadata } from 'next'
import ManageMembers from '@components/bung/ManageMembers'

export default async function Page({ params }: { params: Promise<{ bungId: string }> }) {
  const { bungId } = await params
  return <ManageMembers bungId={bungId} />
}

export const metadata: Metadata = {
  title: '멤버 관리',
}
