'use client'

import clsx from 'clsx'
import { useQueryState } from 'nuqs'

type Category = 'normal' | 'repeat'

export default function CategoryTab() {
  const [selectedCategory, setSelectedCategory] = useQueryState('category', {
    defaultValue: '',
  })

  const categoryList: Array<{ category: Category; label: string }> = [
    { category: 'normal', label: '일반' },
    { category: 'repeat', label: '반복' },
  ]

  return (
    <div className='w-full border-b border-gray pl-24'>
      {categoryList.map((category) => (
        <button
          key={category.category}
          className={clsx(
            'px-16 pb-8 text-14 font-bold',
            category.category === selectedCategory && 'border-b-2 border-primary text-primary',
          )}
          onClick={() => setSelectedCategory(category.category)}>
          {category.label}
        </button>
      ))}
    </div>
  )
}
