'use client'

import { useQueryState } from 'nuqs'
import { ReactNode } from 'react'

export default function CategoryList({ normal, repeat }: { normal: ReactNode; repeat: ReactNode }) {
  const [selectedCategory] = useQueryState('category', {
    defaultValue: '',
  })

  return selectedCategory === 'normal' ? normal : repeat
}
