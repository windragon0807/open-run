'use client'

import Image from 'next/image'

import Header from './Header'
import Category from './Category'
import AvatarList from './AvatarList'

export default function AvatarCloset() {
  return (
    <article className='w-full h-full'>
      <Header onSaveButtonClick={() => {}} />

      <section className='w-full h-[calc(100%-60px)] bg-gray-lighten flex flex-col items-center'>
        <section className='w-full px-16 shadow-custom-white bg-white z-10'>
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

        <Category />

        <AvatarList />
      </section>
    </article>
  )
}
