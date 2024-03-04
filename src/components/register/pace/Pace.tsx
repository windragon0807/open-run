import Spacing from '@shared/Spacing'
import Title from '../shared/Title'
import SubTitle from '../shared/SubTitle'
import Emoji from '../shared/Emoji'
import { Pace } from '@/models/user'

type Props = {
  pace?: Pace
  setPace: (pace: Pace) => void
}

export default function Pace({ pace, setPace }: Props) {
  return (
    <section className='flex flex-col items-center'>
      <Emoji>🏃🏻‍♂️</Emoji>
      <Spacing size={20} />
      <Title>달리기 속도가 어떻게 되시나요?</Title>
      <Spacing size={10} />
      <SubTitle>평균 페이스를 입력해주세요.</SubTitle>
      <Spacing size={20} />
    </section>
  )
}
