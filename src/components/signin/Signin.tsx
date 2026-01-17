'use client'

import { MODAL_KEY } from '@/constants/modal'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { SmartWalletConnectResponse } from '@type/app'
import { postMessageToRN } from '@shared/AppBridge'
import LoadingLogo from '@shared/LoadingLogo'
import { useMessageHandler } from '@hooks/useMessageHandler'
import { useSmartWalletLogin } from '@apis/v1/users/login/smart_wallet/mutation'
import { removeCookie } from '@utils/cookie'
import { MESSAGE } from '@constants/app'
import { COOKIE } from '@constants/cookie'
import { colors } from '@styles/colors'
import DontWorryModal from './DontWorryModal'

export default function Signin() {
  const { isApp } = useAppStore()
  return isApp ? <SignInApp /> : <SignInBrowser />
}

function SignInApp() {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: smartWalletLogin } = useSmartWalletLogin()

  useMessageHandler(({ type, data }) => {
    switch (type) {
      case MESSAGE.RESPONSE_SMART_WALLET_CONNECT:
        smartWalletLogin({ code: data as SmartWalletConnectResponse })
        break

      case MESSAGE.RESPONSE_SMART_WALLET_CONNECT_ERROR:
        setIsLoading(false)
        break
    }
  })

  useEffect(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
    postMessageToRN({ type: MESSAGE.DISCONNECT_SMART_WALLET })
  }, [])

  return (
    <div className='absolute bottom-56 flex w-full flex-col gap-8 px-16'>
      <SmartWalletLoginButton
        isLoading={isLoading}
        onClick={() => {
          setIsLoading(true)
          postMessageToRN({ type: MESSAGE.REQUEST_SMART_WALLET_CONNECT })
        }}
      />
      <DontWorryGuide />
    </div>
  )
}

function SignInBrowser() {
  const { address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: smartWalletLogin } = useSmartWalletLogin()

  const handleLoginButtonClick = () => {
    setIsLoading(true)

    if (address) {
      smartWalletLogin({ code: address })
      return
    }

    connect(
      { connector: connectors[0] },
      {
        onSuccess: (data) => {
          setIsLoading(false)
          const address = data.accounts[0]
          smartWalletLogin({ code: address })
        },
      },
    )
  }

  useEffect(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
    address && disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='absolute bottom-40 flex w-full flex-col gap-8 px-16'>
      <SmartWalletLoginButton isLoading={isLoading} onClick={handleLoginButtonClick} />
      <DontWorryGuide />
    </div>
  )
}

function SmartWalletLoginButton({ isLoading, onClick }: { isLoading: boolean; onClick?: () => void }) {
  return (
    <button
      className='active:scale-98 relative flex h-56 w-full items-center justify-center gap-8 rounded-8 bg-primary active-press-duration active:bg-primary-darken'
      disabled={isLoading}
      onClick={onClick}>
      <span className='absolute -top-16 rounded-12 border border-primary bg-white px-12 py-4 text-12 font-semibold'>
        NFT 보상을 받기 위한 전용 월렛이 필요해요
      </span>
      <span className='text-16 font-bold text-white'>
        {isLoading ? <LoadingLogo className='translate-y-[3px] mx-auto' /> : '월렛 만들고 시작하기'}
      </span>
    </button>
  )
}

function DontWorryGuide() {
  const { showModal } = useModal()
  return (
    <button
      className='active:scale-98 flex h-32 w-full items-center justify-center gap-4 rounded-8 bg-white active-press-duration active:bg-gray/30'
      onClick={() => showModal({ key: MODAL_KEY.DONT_WORRY, component: <DontWorryModal /> })}>
      <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
        <circle
          className='fill-gray-lighten stroke-gray'
          cx='7.99992'
          cy='7.99967'
          r='6.33333'
          strokeWidth='0.666667'
        />
        <path
          className='fill-gray-darker'
          d='M7.45722 5.37111C7.45722 5.11037 7.54698 4.9 7.72649 4.74C7.9118 4.58 8.13474 4.5 8.39533 4.5C8.65592 4.5 8.87597 4.58 9.05548 4.74C9.24079 4.9 9.33344 5.11037 9.33344 5.37111C9.33344 5.63185 9.24079 5.84222 9.05548 6.00222C8.87597 6.16222 8.65592 6.24222 8.39533 6.24222C8.13474 6.24222 7.9118 6.16222 7.72649 6.00222C7.54698 5.84222 7.45722 5.63185 7.45722 5.37111ZM7.35296 7.41111H8.95991L8.2737 11.5H6.66675L7.35296 7.41111Z'
        />
      </svg>
      <span className='text-12'>월렛 로그인, 안심하고 진행하세요!</span>
    </button>
  )
}
