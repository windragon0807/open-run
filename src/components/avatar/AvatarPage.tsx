'use client'

import { useState } from 'react'
import { Avatar, SelectedCategory, WearingAvatar } from '@/types/avatar'
import Header from './Header'
import Category from './Category'
import AvatarList from './AvatarList'
import AvatarCloset from './AvatarCloset'

export default function AvatarPage({
  avatarList,
  wearingAvatar,
}: {
  avatarList: Avatar[]
  wearingAvatar: WearingAvatar
}) {
  const [selectedAvatar, setSelectedAvatar] = useState<WearingAvatar>(wearingAvatar)
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
    mainCategory: null,
    subCategory: null,
  })

  const filteredAvatarList = avatarList.filter((avatar) => {
    if (selectedCategory.mainCategory === null) return true
    if (selectedCategory.mainCategory === avatar.mainCategory) {
      if (selectedCategory.subCategory === null) return true
      return selectedCategory.subCategory === avatar.subCategory
    }
    return false
  })

  return (
    <article className='w-full h-full'>
      <Header onSaveButtonClick={() => {}} />

      <section className='w-full h-[calc(100%-60px)] bg-gray-lighten flex flex-col items-center'>
        <AvatarCloset selectedAvatar={selectedAvatar} />
        <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <AvatarList
          avatarList={filteredAvatarList}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
        />
      </section>
    </article>
  )
}
