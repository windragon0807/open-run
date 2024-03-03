import Spacing from '@shared/Spacing'
import Title from './Title'
import SubTitle from './SubTitle'
import Emoji from './Emoji'

export default function Hello() {
  return (
    <section className='flex flex-col items-center'>
      <Emoji>🙌🏻</Emoji>
      <Spacing size={40} />
      <Title>안녕하세요~!</Title>
      <Spacing size={10} />
      <SubTitle>오픈런에 오신 걸 환영해요.</SubTitle>
    </section>
  )
}
