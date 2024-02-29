import Image from 'next/image'

import Spacing from '@shared/Spacing'
import InputText from './InputText'

type Props = {
  nickname: string
  setNickname: (nickname: string) => void
  isValid: boolean | null
}

export default function Nickname({ nickname, setNickname, isValid }: Props) {
  return (
    <section className="flex flex-col items-center">
      <Image src="/images/register/eye.png" alt="안녕하세요" width={100} height={100} />
      <Spacing size={20} />
      <h1 className="text-white text-4xl 2xl:text-6xl font-bold">당신은 어떤 러너인가요?</h1>
      <Spacing size={10} />
      <p className="text-white text-lg 2xl:text-xl font-normal">재미있는 닉네임을 지어주세요.</p>
      <Spacing size={20} />
      <InputText value={nickname} isValid={isValid} onChange={setNickname} />
    </section>
  )
}
