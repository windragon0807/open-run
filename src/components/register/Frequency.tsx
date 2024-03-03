import Spacing from '@shared/Spacing'
import Title from './Title'
import SubTitle from './SubTitle'
import Emoji from './Emoji'

export default function Frequency() {
  return (
    <section className='flex flex-col items-center'>
      <Emoji>🎯</Emoji>
      <Spacing size={20} />
      <Title>일주일에 몇 번 뛰나요?</Title>
      <Spacing size={10} />
      <SubTitle>당신의 목표를 알려주세요!</SubTitle>
      <Spacing size={20} />
    </section>
  )
}
