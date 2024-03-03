import Spacing from '@shared/Spacing'
import Title from './Title'
import SubTitle from './SubTitle'
import Emoji from './Emoji'

export default function Welcome() {
  return (
    <section className='flex flex-col items-center'>
      <Emoji>👏🏻</Emoji>
      <Spacing size={40} />
      <Title>오픈런에 온 걸 환영해요!</Title>
      <Spacing size={10} />
      <SubTitle>저희와 함께 러닝라이프를 즐겨보아요!</SubTitle>
    </section>
  )
}
