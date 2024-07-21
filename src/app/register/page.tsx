import { Metadata } from 'next'
import Register from '@components/register/Register'


export default function RegisterPage() {
  return <Register />
}

export const metadata: Metadata = {
  title: 'OpenRun | 회원가입',
  description: "OpenRun, Let's run together!",
}
