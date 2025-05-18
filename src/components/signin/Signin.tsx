'use client'

import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import LoadingLogo from '@shared/LoadingLogo'
import { useSmartWalletLogin } from '@apis/auth/smartWalletLogin/mutation'
import { removeCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'
import { colors } from '@styles/colors'

export default function SignIn() {
  const { address } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { mutate: smartWalletLogin, isLoading } = useSmartWalletLogin()

  const handleLoginButtonClick = () => {
    if (address) {
      smartWalletLogin({ code: address })
      return
    }

    connect(
      { connector: connectors[0] },
      {
        onSuccess: (data) => {
          const address = data.accounts[0]
          smartWalletLogin({ code: address })
        },
      },
    )
  }

  useEffect(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
  }, [])

  const 로그인프로세스중인가 = isPending || isLoading

  return (
    <div className='absolute bottom-40 w-full px-16'>
      <button
        className='relative flex h-56 w-full items-center justify-center gap-8 rounded-8 bg-primary hover:bg-primary/90'
        onClick={handleLoginButtonClick}>
        <span className='absolute -top-16 rounded-12 border border-primary bg-white px-12 py-4 text-12 font-semibold'>
          NFT 보상을 받기 위한 전용 월렛이 필요해요
        </span>
        <span className='text-16 font-bold text-white'>
          {로그인프로세스중인가 ? <LoadingLogo color={colors.white} className='mx-auto' /> : '월렛 만들고 시작하기'}
        </span>
      </button>
      <button className='mt-16 w-full text-center' onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  )
}
