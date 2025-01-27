import { Metadata } from 'next'
import Layout from '@shared/Layout'
import AvatarPage from '@components/avatar/AvatarPage'
import { fetchNftList } from '@apis/nfts/fetchNftList/api'
import { fetchWearingAvatar } from '@apis/nfts/fetchWearingAvatar/api'

export default async function Page() {
  const { data: avatarList } = await fetchNftList()
  const { data: wearingAvatar } = await fetchWearingAvatar()

  return (
    <Layout>
      <AvatarPage avatarList={avatarList} wearingAvatar={wearingAvatar} />
    </Layout>
  )
}

export const metadata: Metadata = {
  title: '아바타',
}
