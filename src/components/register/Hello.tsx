import Image from 'next/image'

import Spacing from '@shared/Spacing'

export default function Hello() {
  return (
    <section className='flex flex-col items-center'>
      <Image src='/images/register/high_five.png' alt='안녕하세요' width={100} height={100} />
      <Spacing size={40} />
      <h1 className='text-white text-4xl 2xl:text-6xl font-bold'>안녕하세요~!</h1>
      <Spacing size={10} />
      <p className='text-white text-lg 2xl:text-xl font-normal'>오픈런에 오신 걸 환영해요.</p>
    </section>
  )
}
