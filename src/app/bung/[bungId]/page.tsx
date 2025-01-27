import { Metadata } from 'next'
import { fetchUserInfo } from '@apis/users/fetchUserInfo/api'
import { fetchBungDetail } from '@apis/bungs/fetchBungDetails/api'
import PageCategory from '@components/bung/PageCategory'

type Props = {
  params: {
    bungId: string
  }
}

export default async function Page({ params: { bungId } }: Props) {
  const { data: userInfo } = await fetchUserInfo()
  const { data: bungDetail } = await fetchBungDetail({ bungId })

  const userId = userInfo.userId
  const isParticipated = bungDetail.memberList.some((participant) => participant.userId === userId)
  const isOwner = bungDetail.memberList.find((participant) => participant.userId === userId)?.owner ?? false

  return <PageCategory details={bungDetail} isParticipated={isParticipated} isOwner={isOwner} />
}

export async function generateMetadata({ params: { bungId } }: Props): Promise<Metadata> {
  const { data: bungDetail } = await fetchBungDetail({ bungId })
  return {
    title: bungDetail.name,
  }
}
