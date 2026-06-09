import { Metadata } from 'next'
import ChallengePage from '@components/challenges/ChallengePage'

export default function Page() {
  return <ChallengePage />
}

export const metadata: Metadata = {
  title: '도전 과제',
}
