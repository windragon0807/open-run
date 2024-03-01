import Image from 'next/image'

import Spacing from '@shared/Spacing'
import Title from './Title'
import SubTitle from './SubTitle'

export default function Frequency() {
  return (
    <section className='flex flex-col items-center'>
      <Image src='/images/register/target.png' alt='Frequence 이미지' width={100} height={100} />
      <Spacing size={20} />
      <Title>일주일에 몇 번 뛰나요?</Title>
      <Spacing size={10} />
      <SubTitle>당신의 목표를 알려주세요!</SubTitle>
      <Spacing size={20} />
    </section>
  )
}
