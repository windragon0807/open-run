import { Metadata } from 'next'
import Form from '@components/profile/modify-user/Form'
import ProfileSubpageShell from '@components/profile/ProfileSubpageShell'

export default function Page() {
  return (
    <ProfileSubpageShell title='회원 정보 수정'>
      <Form />
    </ProfileSubpageShell>
  )
}

export const metadata: Metadata = {
  title: '회원 정보 수정',
}
