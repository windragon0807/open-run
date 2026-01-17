'use client'

import html2canvas from 'html2canvas'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { Avatar, SelectedCategory, WearingAvatar } from '@type/avatar'
import AvatarComponent from '@shared/Avatar'
import { ArrowLeftIcon } from '@icons/arrow'
import { TransparentOpenrunIcon } from '@icons/openrun'
import { ResetIcon } from '@icons/reset'
import { cropSquareImage } from '@utils/image'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import AvatarCaptureModal from './AvatarCaptureModal'
import AvatarList from './AvatarList'
import Category from './Category'

export default function AvatarPage({
  avatarList,
  wearingAvatar,
}: {
  avatarList: Avatar[]
  wearingAvatar: WearingAvatar
}) {
  const router = useRouter()
  const { showModal } = useModal()

  const avatarRef = useRef<HTMLDivElement>(null)
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

  const handleReset = () => {
    setSelectedAvatar({
      upperClothing: null,
      lowerClothing: null,
      fullSet: null,
      footwear: null,
      face: null,
      skin: null,
      hair: null,
      accessories: {
        'head-accessories': null,
        'ear-accessories': null,
        'body-accessories': null,
        'eye-accessories': null,
      },
    })
  }

  const handleCapture = async () => {
    if (!avatarRef.current) return

    const canvas = await html2canvas(avatarRef.current, { backgroundColor: null })
    const originalImgData = canvas.toDataURL('image/png')

    // 원형으로 자르기
    const circularImgData = await cropSquareImage(originalImgData)

    showModal({
      key: MODAL_KEY.AVATAR_CAPTURE,
      component: <AvatarCaptureModal imgData={circularImgData} />,
    })
  }

  return (
    <article className='h-full w-full bg-white app:pt-50'>
      {/* 헤더 */}
      <header className='relative z-20 flex h-60 w-full items-center justify-center bg-white px-5'>
        <button
          className='absolute left-16 -translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
          onClick={() => router.back()}>
          <ArrowLeftIcon size={24} color={colors.black.darken} />
        </button>
        <h1 className='text-16 font-bold text-black'>아바타 변경</h1>
        <button
          className='absolute right-16 translate-x-8 rounded-8 px-8 py-4 active-press-duration active:scale-90 active:bg-gray/50'
          onClick={handleCapture}>
          <span className='text-14 text-black'>저장</span>
        </button>
      </header>

      <section className='flex h-[calc(100%-60px)] w-full flex-col items-center bg-gray-lighten'>
        {/* 아바타 영역 */}
        <section className='z-10 w-full bg-white px-16 shadow-floating-primary'>
          <div className='relative mb-16 flex h-248 w-full justify-center rounded-16 bg-black-darken'>
            {/* 오픈런 아이콘 */}
            <TransparentOpenrunIcon
              className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              size={160}
              color={colors.white}
            />

            {/* 아바타 이미지 */}
            <AvatarComponent
              ref={avatarRef}
              className='absolute top-16 h-270 w-216 flex-shrink-0'
              {...selectedAvatar}
            />

            {/* 초기화 버튼 */}
            <button
              className='absolute bottom-8 right-8 flex aspect-square w-[40px] items-center justify-center rounded-full bg-white active-press-duration active:scale-90 active:bg-white/90'
              onClick={handleReset}>
              <ResetIcon />
            </button>
          </div>
        </section>

        {/* 카테고리 */}
        <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* 보유하고 있는 아바타 리스트 */}
        <AvatarList
          avatarList={filteredAvatarList}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
        />
      </section>
    </article>
  )
}

function Parts({ src, alt }: { src: string; alt: string }) {
  return <Image className='object-contain' src={src} alt={alt} priority fill sizes='(max-width: 768px) 100vw, 33vw' />
}
