import Spacing from '@shared/Spacing'
import InputText from './InputText'
import Title from './Title'
import SubTitle from './SubTitle'
import Emoji from './Emoji'

type Props = {
  nickname: string
  setNickname: (nickname: string) => void
  isValid: boolean | null
}

export default function Nickname({ nickname, setNickname, isValid }: Props) {
  return (
    <section className='flex flex-col items-center'>
      <Emoji>👀</Emoji>
      <Spacing size={20} />
      <Title>당신은 어떤 러너인가요?</Title>
      <Spacing size={10} />
      <SubTitle>재미있는 닉네임을 지어주세요.</SubTitle>
      <Spacing size={20} />
      <InputText value={nickname} isValid={isValid} onChange={setNickname} />
    </section>
  )
}
