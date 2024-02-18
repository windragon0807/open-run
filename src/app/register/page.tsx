import Header from '@/components/register/Header'
import Spacing from '@/components/shared/Spacing'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenRun | Register',
  description: "OpenRun, Let's run together!",
}

export default function Register() {
  return (
    <main className="w-full h-full bg-primary flex flex-col items-center">
      <Spacing size={20} />

      <Header />
    </main>
  )
}
