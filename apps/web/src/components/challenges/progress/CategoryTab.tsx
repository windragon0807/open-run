'use client'

import clsx from 'clsx'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CategoryType } from '@type/challenge'

type ProgressCategory = Extract<CategoryType, 'general' | 'repetitive'>

const CATEGORY_LIST: Array<{ category: ProgressCategory; label: string }> = [
  { category: 'general', label: '일반' },
  { category: 'repetitive', label: '반복' },
]

type CategoryTabProps = {
  selectedCategory?: ProgressCategory
  onCategoryChange?: (category: ProgressCategory) => void
}

export default function CategoryTab({
  selectedCategory: controlledSelectedCategory,
  onCategoryChange,
}: CategoryTabProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldReduceMotion = useReducedMotion()
  const selectedCategory = getProgressCategory(searchParams.get('category'))
  const [optimisticCategory, setOptimisticCategory] = useState<ProgressCategory>(selectedCategory)
  const currentCategory = controlledSelectedCategory ?? optimisticCategory

  useEffect(() => {
    setOptimisticCategory(selectedCategory)
  }, [selectedCategory])

  const handleCategoryChange = (category: ProgressCategory) => {
    setOptimisticCategory(category)
    onCategoryChange?.(category)
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <LayoutGroup id='challenge-category-tab'>
      <div className='border-gray w-full border-b pl-24'>
        {CATEGORY_LIST.map(({ category, label }) => {
          const isSelected = category === currentCategory

          return (
            <button
              key={category}
              className={clsx(
                'text-14 relative border-b-2 border-transparent px-16 pb-8 font-bold transition-colors',
                isSelected ? 'text-primary' : 'text-black',
              )}
              aria-pressed={isSelected}
              onClick={() => handleCategoryChange(category)}
            >
              {label}
              {isSelected && (
                <motion.div
                  layoutId='challenge-category-tab-underline'
                  className='bg-primary absolute -bottom-2 left-0 right-0 h-2'
                  transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

function getProgressCategory(category: string | null): ProgressCategory {
  return category === 'repetitive' ? 'repetitive' : 'general'
}
