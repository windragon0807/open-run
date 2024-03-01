import Image from 'next/image'

import Spacing from '@shared/Spacing'
import InputText from './InputText'
import Title from './Title'
import SubTitle from './SubTitle'

type Props = {
  nickname: string
  setNickname: (nickname: string) => void
  isValid: boolean | null
}

export default function Nickname({ nickname, setNickname, isValid }: Props) {
  return (
    <section className='flex flex-col items-center'>
      <Image src='/images/register/eye.png' alt='Nickname 이미지' width={100} height={100} />
      <Spacing size={20} />
      <Title>당신은 어떤 러너인가요?</Title>
      <Spacing size={10} />
      <SubTitle>재미있는 닉네임을 지어주세요.</SubTitle>
      <Spacing size={20} />
      <InputText value={nickname} isValid={isValid} onChange={setNickname} />
    </section>
  )
}
