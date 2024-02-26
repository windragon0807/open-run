import { Metadata } from 'next'

import Register from '@/components/register/Register'

export const metadata: Metadata = {
  title: 'OpenRun | Register',
  description: "OpenRun, Let's run together!",
}

export default function RegisterPage() {
  return (
    <main className="w-full h-full bg-primary">
      <Register />
    </main>
  )
}
