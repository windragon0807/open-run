import { Metadata } from 'next'

import SignIn from '@components/signin/Signin'

export const metadata: Metadata = {
  title: 'OpenRun | Sign In',
  description: "OpenRun, Let's run together!",
}

export default function SignInPage() {
  return (
    <main className='w-full h-full'>
      <SignIn />
    </main>
  )
}
