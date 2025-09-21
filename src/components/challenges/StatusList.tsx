'use client'

import { useQueryState } from 'nuqs'
import { ReactNode } from 'react'

export default function ToggleList({ progress, completed }: { progress: ReactNode; completed: ReactNode }) {
  const [selectedTab] = useQueryState('list', {
    defaultValue: '',
  })

  return selectedTab === 'progress' ? progress : completed
}
