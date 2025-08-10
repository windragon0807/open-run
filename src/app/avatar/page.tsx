import { Metadata } from 'next'
import AvatarPage from '@components/avatar/AvatarPage'
import AuthGuard from '@shared/AuthGuard'
import { fetchNftList } from '@apis/nfts/fetchNftList/query'
import { fetchWearingAvatar } from '@apis/nfts/fetchWearingAvatar'

export default async function Page() {
  const { data: avatarList } = await fetchNftList()
  const { data: wearingAvatar } = await fetchWearingAvatar()

  return (
    <AuthGuard>
      <AvatarPage avatarList={avatarList} wearingAvatar={wearingAvatar} />
    </AuthGuard>
  )
}

export const metadata: Metadata = {
  title: '아바타',
}
