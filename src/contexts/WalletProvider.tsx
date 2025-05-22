'use client'

import { OnchainKitProvider } from '@coinbase/onchainkit'
import { type ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'OnchainKit',
      preference: 'smartWalletOnly',
      version: '4',
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

export function WalletProvider(props: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={props.initialState}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={baseSepolia} // TODO: switch between mainnet / testnet
      >
        {props.children}
      </OnchainKitProvider>
    </WagmiProvider>
  )
}
