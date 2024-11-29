'use client'

import Image from 'next/image'

import Avatars from '@components/avatar/Avatars'
import Header from './Header'

export default function AvatarCloset() {
  return (
    <article className='w-full h-full'>
      <Header onSaveButtonClick={() => {}} />

      <section className='w-full h-[calc(100%-60px)] bg-white flex flex-col items-center'>
        <section className='w-full px-16 shadow-shadow_white'>
          <div className='relative w-full h-248 bg-black-darken rounded-16 mb-16 flex justify-center'>
            <Image
              className='absolute top-16'
              src='/temp/avatar/avatar_bg.png'
              alt='Avatar Background'
              width={216}
              height={216}
            />
            <Image
              className='absolute top-16'
              src='/temp/avatar/avatar_body.png'
              alt='Avatar Body'
              width={216}
              height={270}
            />
          </div>
        </section>

        <Avatars />
      </section>
    </article>
  )
}
