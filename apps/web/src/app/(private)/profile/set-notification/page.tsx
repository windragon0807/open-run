import { Metadata } from 'next'
import Form from '@components/profile/set-notification/Form'
import ProfileSubpageShell from '@components/profile/ProfileSubpageShell'

export default function Page() {
  return (
    <ProfileSubpageShell title='알림 설정'>
      <Form />
    </ProfileSubpageShell>
  )
}

export const metadata: Metadata = {
  title: '알림 설정',
}
