'use client'

import { useState } from 'react'

import SelectedParts from './SelectedParts'
import Header from './Header'
import CategorySelector from './CategorySelector'
import AvatarPreview from './AvatarPreview'
import AvatarParts from './AvatarParts'

export default function CustomAvatar() {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  return (
    <div className='flex flex-col h-full bg-gradient-main'>
      <Header />
      <AvatarPreview />
      <SelectedParts />
      <CategorySelector selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <AvatarParts selectedCategory={selectedCategory} />
    </div>
  )
}
