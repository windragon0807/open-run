import Link from 'next/link'
import { cookies } from 'next/headers'

import { getUserInfo } from '@apis/auth/getUserInfo/api'
import Layout from '@shared/Layout'
import Spacing from '@shared/Spacing'
import LogoutButton from '@components/home/LogoutButton'
import DeleteButton from '@components/home/DeleteButton'

export default async function HomePage() {
  const token = cookies().get('ACCESSTOKEN')?.value

  if (token == null) {
    return (
      <Layout>
        <section className='w-full h-full flex flex-col items-center justify-center'>
          <Link href='/register'>
            <button className='px-20 py-10 text-white bg-primary rounded-8'>회원가입</button>
          </Link>
          <Spacing size={16} />
          <Link href='/signin'>
            <button className='px-20 py-10 text-white bg-primary rounded-8'>로그인</button>
          </Link>
        </section>
      </Layout>
    )
  }

  const { data } = await getUserInfo()
  console.log('userInfo', data)

  return (
    <Layout>
      <section className='w-full h-full flex flex-col items-center justify-center'>
        <div className='p-20 border-2 border-primary rounded-8'>
          <p className='text-center font-bold'>로그인 정보</p>
          <Spacing size={16} />
          <p>닉네임 : {data.nickname}</p>
          <p>이메일 : {data.email}</p>
          <p>로그인 : {data.provider}</p>
          <p>페이스 : {data.runningPace}</p>
          <p>횟수 : {data.runningFrequency}</p>
          <p>생성일 : {data.createdDate}</p>
        </div>
        <Spacing size={40} />
        <Link href='/register'>
          <button className='px-20 py-10 text-white bg-primary rounded-8'>회원가입</button>
        </Link>
        <Spacing size={16} />
        <Link href='/signin'>
          <button className='px-20 py-10 text-white bg-primary rounded-8'>로그인</button>
        </Link>
        <Spacing size={16} />
        <LogoutButton />
        <Spacing size={16} />
        <DeleteButton />
      </section>
    </Layout>
  )
}
