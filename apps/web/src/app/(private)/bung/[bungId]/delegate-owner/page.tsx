import { Metadata } from 'next'
import DelegateOwner from '@components/bung/DelegateOwner'

export default async function Page({ params }: { params: Promise<{ bungId: string }> }) {
  const { bungId } = await params
  return <DelegateOwner bungId={bungId} />
}

export const metadata: Metadata = {
  title: '벙주 넘기기',
}
