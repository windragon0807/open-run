import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import RewardClaimPage from '@components/challenges/rewards/RewardClaimPage'

type Props = {
  params: Promise<{
    userChallengeId: string
  }>
}

export default async function Page({ params }: Props) {
  const { userChallengeId } = await params

  if (!/^[1-9]\d*$/.test(userChallengeId)) {
    redirect('/challenges?list=progress')
  }

  return <RewardClaimPage userChallengeId={Number(userChallengeId)} />
}

export const metadata: Metadata = {
  title: '보상 받기',
}
