import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useAppStore } from '@store/app'

export function useAppRouter() {
  const router = useRouter()
  const { isApp } = useAppStore()

  const push = useCallback(
    (path: string) => {
      if (isApp) {
        window.location.href = path
      } else {
        router.push(path)
      }
    },
    [isApp, router],
  )

  return { push }
}
