import { Metadata } from 'next'
import Link from 'next/link'
import Form from '@components/profile/modify-user/Form'
import AuthGuard from '@shared/AuthGuard'
import ArrowLeftIcon from '@icons/ArrowLeftIcon'
import { colors } from '@styles/colors'

export default function Page() {
  return (
    <AuthGuard>
      <header className='relative mb-24 flex h-60 w-full items-center justify-center'>
        <Link href='/profile' className='absolute left-16'>
          <button>
            <ArrowLeftIcon size={24} color={colors.black.darken} />
          </button>
        </Link>
        <span className='text-16 font-bold text-black'>회원 정보 수정</span>
      </header>
      <Form />
    </AuthGuard>
  )
}

export const metadata: Metadata = {
  title: '회원 정보 수정',
}
