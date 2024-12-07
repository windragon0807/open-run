'use client'

import { useState } from 'react'
import { Avatar, WearingAvatar } from '@/types/avatar'
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

  return (
    <article className='w-full h-full'>
      <Header onSaveButtonClick={() => {}} />

      <section className='w-full h-[calc(100%-60px)] bg-gray-lighten flex flex-col items-center'>
        <AvatarCloset selectedAvatar={selectedAvatar} />
        <Category />
        <AvatarList avatarList={avatarList} selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
      </section>
    </article>
  )
}
