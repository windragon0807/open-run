import { Metadata } from 'next'
import Notifications from '@components/notifications/Notifications'

export default function Page() {
  return <Notifications />
}

export const metadata: Metadata = {
  title: '알림',
}
