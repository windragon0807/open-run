import Image from 'next/image'

import Spacing from '@shared/Spacing'
import Title from './Title'
import SubTitle from './SubTitle'

export default function Hello() {
  return (
    <section className='flex flex-col items-center'>
      <Image src='/images/register/high_five.png' alt='Hello 이미지' width={100} height={100} />
      <Spacing size={40} />
      <Title>안녕하세요~!</Title>
      <Spacing size={10} />
      <SubTitle>오픈런에 오신 걸 환영해요.</SubTitle>
    </section>
  )
}
