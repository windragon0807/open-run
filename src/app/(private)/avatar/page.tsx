import { Metadata } from 'next'
import AvatarPage from '@components/avatar/AvatarPage'
import { fetchNftList } from '@apis/nfts/fetchNftList/query'
import { fetchWearingAvatar } from '@apis/nfts/fetchWearingAvatar'

export default async function Page() {
  const { data: avatarList } = await fetchNftList()
  const { data: wearingAvatar } = await fetchWearingAvatar()

  return <AvatarPage avatarList={avatarList} wearingAvatar={wearingAvatar} />
}

export const metadata: Metadata = {
  title: '아바타',
}
