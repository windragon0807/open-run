'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { useAppStore } from '@store/app'
import { Avatar, SelectedCategory, WearingAvatar } from '@type/avatar'
import AvatarCloset from './AvatarCloset'
import AvatarList from './AvatarList'
import Category from './Category'
import Header from './Header'

export default function AvatarPage({
  avatarList,
  wearingAvatar,
}: {
  avatarList: Avatar[]
  wearingAvatar: WearingAvatar
}) {
  const { isApp } = useAppStore()

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
    <article className={clsx('h-full w-full', isApp && 'pt-50')}>
      <Header onSaveButtonClick={() => {}} />

      <section className='flex h-[calc(100%-60px)] w-full flex-col items-center bg-gray-lighten'>
        <AvatarCloset selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
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
