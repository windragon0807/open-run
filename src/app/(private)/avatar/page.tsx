import { Metadata } from 'next'
import AvatarPage from '@components/avatar/AvatarPage'

export default function Page() {
  return <AvatarPage />
}

export const metadata: Metadata = {
  title: '아바타',
}
