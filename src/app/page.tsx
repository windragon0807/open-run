import Link from 'next/link'

import { getUserInfo } from '@apis/auth/getUserInfo/api'
import Spacing from '@components/shared/Spacing'

export default async function HomePage() {
  const { cookies } = await import('next/headers')
  const token = cookies().get('ACCESSTOKEN')?.value

  if (token == null) {
    return (
      <section className='w-full h-full flex flex-col items-center justify-center'>
        <Spacing size={40} />
        <Link href='/register'>
          <button className='px-20 py-10 text-white bg-primary rounded-8'>회원가입</button>
        </Link>
        <Spacing size={16} />
        <Link href='/signin'>
          <button className='px-20 py-10 text-white bg-primary rounded-8'>로그인</button>
        </Link>
      </section>
    )
  }

  const { data } = await getUserInfo()

  return (
    <section className='w-full h-full flex flex-col items-center justify-center'>
      <div className='p-20 border-2 border-primary rounded-8'>
        <p className='text-center font-bold'>로그인 정보</p>
        <Spacing size={16} />
        <p>닉네임 : {data.nickname}</p>
        <p>이메일 : {data.email}</p>
        <p>로그인 : {data.provider}</p>
        <p>페이스 : {data.runningPace}</p>
        <p>횟수 : {data.runningFrequency}</p>
      </div>
      <Spacing size={40} />
      <Link href='/register'>
        <button className='px-20 py-10 text-white bg-primary rounded-8'>회원가입</button>
      </Link>
      <Spacing size={16} />
      <Link href='/signin'>
        <button className='px-20 py-10 text-white bg-primary rounded-8'>로그인</button>
      </Link>
    </section>
  )
}
