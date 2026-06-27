import { ReactNode } from 'react'
import BottomNavigation from '@shared/BottomNavigation'
import PersistentNavigationTabs from '@shared/PersistentNavigationTabs'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <PersistentNavigationTabs fallback={children} />
      <BottomNavigation />
    </>
  )
}
