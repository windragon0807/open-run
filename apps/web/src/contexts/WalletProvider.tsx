'use client'

import { createAppKit } from '@reown/appkit/react'
import { base, baseSepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { type ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { FEATURED_WALLET_IDS, REOWN_PROJECT_ID } from '@constants/wallet'

const projectId = REOWN_PROJECT_ID
const networks = [base, baseSepolia] as [AppKitNetwork, ...AppKitNetwork[]]

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  ssr: true,
})

createAppKit({
  projectId,
  networks,
  defaultNetwork: baseSepolia,
  adapters: [wagmiAdapter],
  allWallets: 'SHOW',
  showWallets: true,
  featuredWalletIds: FEATURED_WALLET_IDS,
  features: {
    analytics: false,
    email: false,
    emailShowWallets: true,
    socials: ['google', 'apple', 'discord', 'github'],
  },
  metadata: {
    name: 'Open Run',
    description: 'Open Run App',
    // metadata.url이 실제 페이지 origin과 다르면 WalletConnect가 경고하고 일부 지갑이 연결을 거부할 수 있다.
    // localhost/preview/production 어디서든 현재 origin을 그대로 사용한다. (모듈이 SSR에서도 평가되므로 window 가드 필요)
    url: typeof window !== 'undefined' ? window.location.origin : 'https://open-run.vercel.app',
    icons: [],
  },
})

export function WalletProvider(props: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={props.initialState}>
      {props.children}
    </WagmiProvider>
  )
}
