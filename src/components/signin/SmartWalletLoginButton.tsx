'use client'

import Image from 'next/image'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { useAccount } from 'wagmi'

export default function SmartWalletLoginButton({ onClick }: { onClick?: () => Promise<void> }) {
  const { isConnected } = useAccount()

  return (
    <div>
      {!isConnected ? (
        <ConnectWallet>
          <button
            className='flex h-56 w-full items-center justify-center gap-8 rounded-8 bg-[#0052FF] hover:bg-[#0043CC]'
          >
            <Image src='/images/wallet.svg' width={24} height={24} alt='Wallet' />
            <span className='text-16 font-bold text-white'>Connect Wallet</span>
          </button>
        </ConnectWallet>
      ) : (
        <button
          className='flex h-56 w-full items-center justify-center gap-8 rounded-8 bg-[#0052FF] hover:bg-[#0043CC]'
          onClick={onClick}
        >
          <Image src='/images/wallet.svg' width={24} height={24} alt='Wallet' />
          <span className='text-16 font-bold text-white'>Sign in with Wallet</span>
        </button>
      )}
    </div>
  )
} 