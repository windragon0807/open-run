'use client'

import { useMutation } from 'react-query'

import { deleteUser as _deleteUser } from '@apis/auth/deleteUser/api'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const { mutate: deleteUser } = useMutation(_deleteUser, {
    onSuccess: () => {
      router.replace('/signin')
    },
  })

  return (
    <button
      className='px-20 py-10 bg-red text-white rounded-8'
      onClick={() => {
        if (window.confirm('정말 계정을 삭제하시겠습니까?')) {
          deleteUser()
        }
      }}>
      회원 탈퇴
    </button>
  )
}
