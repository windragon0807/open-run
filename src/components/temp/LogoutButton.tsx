'use client'

import useLogout from '@hooks/useLogout'

export default function LogoutButton() {
  const { logout } = useLogout()

  return (
    <button className='px-20 py-10 bg-secondary rounded-8' onClick={logout}>
      로그아웃
    </button>
  )
}
