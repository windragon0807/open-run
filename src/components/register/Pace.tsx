import Spacing from '@shared/Spacing'
import Title from './Title'
import SubTitle from './SubTitle'
import Emoji from './Emoji'

export default function Pace() {
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
