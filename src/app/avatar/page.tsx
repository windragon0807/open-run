import { Metadata } from 'next'
import AuthGuard from '@shared/AuthGuard'
import Layout from '@shared/Layout'
import AvatarPage from '@components/avatar/AvatarPage'
import { fetchNftList } from '@apis/nfts/fetchNftList/query'
import { fetchWearingAvatar } from '@apis/nfts/fetchWearingAvatar/query'

export default async function Page() {
  const { data: avatarList } = await fetchNftList()
  const { data: wearingAvatar } = await fetchWearingAvatar()

  return (
    <AuthGuard>
      <Layout>
        <AvatarPage avatarList={avatarList} wearingAvatar={wearingAvatar} />
      </Layout>
    </AuthGuard>
  )
}

export const metadata: Metadata = {
  title: '아바타',
}
