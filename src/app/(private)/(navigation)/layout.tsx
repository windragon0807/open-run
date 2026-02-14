import { ReactNode } from 'react'
import BottomNavigation from '@shared/BottomNavigation'
import ChatBot from '@components/chat/ChatBot'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <BottomNavigation />
      <ChatBot />
    </>
  )
}
