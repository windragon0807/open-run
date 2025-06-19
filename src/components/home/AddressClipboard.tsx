import { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useAccount } from 'wagmi'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { postMessageToRN } from '@shared/AppBridge'
import { useMessageHandler } from '@hooks/useMessageHandler'
import { MESSAGE } from '@constants/app'
import { MODAL_KEY } from '@constants/modal'
import CompleteCopyToast from './CompleteCopyToast'

export default function AddressClipboard() {
  const { isApp } = useAppStore()

  return isApp ? <AddressClipboardApp /> : <AddressClipboardBrowser />
}

function AddressClipboardApp() {
  const [address, setAddress] = useState('')

  useMessageHandler(({ type, data }) => {
    switch (type) {
      case MESSAGE.RESPONSE_SMART_WALLET_CONNECT:
        setAddress(data as string)
        break
    }
  })

  useEffect(() => {
    if (address) return
    postMessageToRN({ type: MESSAGE.REQUEST_SMART_WALLET_CONNECT })
  }, [address])

  return <CommonComponent address={address} />
}

function AddressClipboardBrowser() {
  const { address } = useAccount()
  return <CommonComponent address={address ?? ''} />
}

function CommonComponent({ address }: { address: string }) {
  const { showModal } = useModal()

  return (
    <CopyToClipboard
      text={address ?? ''}
      onCopy={() =>
        showModal({
          key: MODAL_KEY.COMPLETE_COPY_TOAST,
          component: <CompleteCopyToast />,
        })
      }>
      <div className='flex cursor-pointer items-center gap-6'>
        <span className='text-12 text-white'>{formatAddress(address)}</span>
        <svg className='-translate-y-1' width={12} height={12} viewBox='0 0 10 10'>
          <path
            className='fill-white'
            d='M7.91699 1.45801H2.91699V0.625H8.75V7.70801H7.91699V1.45801ZM1.25 9.375V2.29199H7.08301V9.375H1.25Z'
          />
        </svg>
      </div>
    </CopyToClipboard>
  )
}

// address를 앞 4글자, 뒤 4글자만 보여주고 가운데는 ***로 처리하는 함수
function formatAddress(address: string | undefined): string {
  if (!address) return ''
  if (address.length <= 8) return address
  return `${address.slice(0, 4)}***${address.slice(-4)}`
}
