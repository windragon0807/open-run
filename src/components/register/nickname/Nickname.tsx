import Spacing from '@shared/Spacing'
import InputText from './InputText'
import Title from '../shared/Title'
import SubTitle from '../shared/SubTitle'
import Emoji from '../shared/Emoji'

export default function Nickname({
  nickname,
  setNickname,
  isValid,
}: {
  nickname: string
  setNickname: (nickname: string) => void
  isValid: boolean | null
}) {
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
