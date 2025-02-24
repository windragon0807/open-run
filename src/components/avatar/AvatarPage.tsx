'use client'

import { useState } from 'react'
import { Avatar, SelectedCategory, WearingAvatar } from '@type/avatar'
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
    mainCategory: 'upperClothing',
    subCategory: null,
  })

  const filteredAvatarList = avatarList.filter((avatar) => {
    if (selectedCategory.mainCategory === avatar.mainCategory) {
      if (selectedCategory.subCategory === null) return true
      return selectedCategory.subCategory === avatar.subCategory
    }
    return false
  })

  return (
    <article className='h-full w-full'>
      <Header onSaveButtonClick={() => {}} />

      <section className='flex h-[calc(100%-60px)] w-full flex-col items-center bg-gray-lighten'>
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
