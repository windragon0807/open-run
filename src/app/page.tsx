import { redirect } from 'next/navigation'

export default function HomePage() {
  // FIXME: 리다이렉트
  redirect('/signin')

  return <main>Home</main>
}
