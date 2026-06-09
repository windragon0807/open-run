'use client'

import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ListType } from '@type/challenge'
import { OutlinedFlagIcon } from '@icons/flag'
import { colors } from '@styles/colors'

type ListTabProps = {
  selectedTab?: ListType
  onTabChange?: (tab: ListType) => void
}

export default function ListTab({ selectedTab: controlledSelectedTab, onTabChange }: ListTabProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldReduceMotion = useReducedMotion()
  const selectedTab = getSelectedTab(searchParams.get('list'))
  const [optimisticTab, setOptimisticTab] = useState<ListType>(selectedTab)
  const currentTab = controlledSelectedTab ?? optimisticTab

  useEffect(() => {
    setOptimisticTab(selectedTab)
  }, [selectedTab])

  const handleToggle = () => {
    const newTab = currentTab === 'progress' ? 'completed' : 'progress'
    const newCategory = newTab === 'progress' ? 'general' : ''

    setOptimisticTab(newTab)
    onTabChange?.(newTab)
    const params = new URLSearchParams(searchParams.toString())
    params.set('list', newTab)
    if (newCategory) {
      params.set('category', newCategory)
    } else {
      params.delete('category')
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <button
      className='h-34 shadow-floating-primary relative isolate inline-flex items-center rounded-full'
      aria-pressed={currentTab === 'progress'}
      onClick={handleToggle}
      type='button'
    >
      {/* 배경 애니메이션 */}
      <motion.div
        className='h-30 absolute top-2 z-0 rounded-full bg-black'
        initial={false}
        animate={{
          x: currentTab === 'progress' ? 0 : 76,
          width: currentTab === 'progress' ? 76 : 43,
        }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
      />

      <div className='relative z-10 rounded-full transition-colors'>
        <div
          className={clsx(
            'flex items-center gap-2 px-10 py-5',
            currentTab === 'progress' ? 'text-white' : 'text-gray-darken',
          )}
        >
          <OutlinedFlagIcon size={16} color={currentTab === 'progress' ? colors.white : colors.gray.darken} />
          <span className='text-14 font-bold'>진행 중</span>
        </div>
      </div>

      <div className='relative z-10 rounded-full transition-colors'>
        <div
          className={clsx(
            'flex items-center gap-8 px-10 py-5',
            currentTab === 'completed' ? 'text-white' : 'text-gray-darken',
          )}
        >
          <span className='text-14 font-bold'>완료</span>
        </div>
      </div>
    </button>
  )
}

function getSelectedTab(list: string | null): ListType {
  return list === 'progress' ? 'progress' : 'completed'
}
