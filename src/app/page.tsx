import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const token = cookies().get('ACCESSTOKEN')?.value
  if (token == null) {
    redirect('/signin')
  }

  return <div>Home</div>
}
