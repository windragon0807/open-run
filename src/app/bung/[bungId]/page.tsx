import { Metadata } from 'next'
import AuthGuard from '@shared/AuthGuard'
import { fetchBungDetail } from '@apis/bungs/fetchBungDetails/query'
import PageCategory from '@components/bung/PageCategory'
import { fetchUserInfo } from '@apis/users/fetchUserInfo/query'

type Props = {
  params: {
    bungId: string
  }
}

export default async function Page({ params: { bungId } }: Props) {
  const { data: userInfo } = await fetchUserInfo()
  const bungDetail = await fetchBungDetail({ bungId })

  const userId = userInfo.userId
  const isParticipated = bungDetail.memberList.some((participant) => participant.userId === userId)
  const isOwner = bungDetail.memberList.find((participant) => participant.userId === userId)?.owner ?? false

  return (
    <AuthGuard>
      <PageCategory details={bungDetail} isParticipated={isParticipated} isOwner={isOwner} />
    </AuthGuard>
  )
}

export async function generateMetadata({ params: { bungId } }: Props): Promise<Metadata> {
  const bungDetail = await fetchBungDetail({ bungId })
  return {
    title: bungDetail.name,
  }
}
