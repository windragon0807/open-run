import Image from 'next/image'

import { useModalContext } from '@contexts/ModalContext'
import DetailModal from './DetailModal'
import { Avatar, SubCategory, WearingAvatar } from '@type/avatar'
import RarityIcon from './shared/RarityIcon'
import { colors } from '@styles/colors'

export default function AvatarList({
  avatarList,
  selectedAvatar,
  setSelectedAvatar,
}: {
  avatarList: Avatar[]
  selectedAvatar: WearingAvatar
  setSelectedAvatar: (avatar: WearingAvatar) => void
}) {
  const { openModal } = useModalContext()

  const handleAvatarSelect = (avatar: Avatar) => {
    if (avatar.mainCategory === 'accessories') {
      if (selectedAvatar.accessories?.[avatar.subCategory as SubCategory]?.id === avatar.id) {
        setSelectedAvatar({
          ...selectedAvatar,
          accessories: {
            ...selectedAvatar.accessories,
            [avatar.subCategory as SubCategory]: null,
          },
        })
      } else {
        setSelectedAvatar({
          ...selectedAvatar,
          accessories: {
            ...selectedAvatar.accessories,
            [avatar.subCategory as SubCategory]: avatar,
          },
        })
      }
    } else {
      if (selectedAvatar[avatar.mainCategory]?.id === avatar.id) {
        setSelectedAvatar({
          ...selectedAvatar,
          [avatar.mainCategory]: null,
        })
      } else {
        setSelectedAvatar({
          ...selectedAvatar,
          [avatar.mainCategory]: avatar,
        })
      }
    }
  }

  return (
    <section className='w-full h-full overflow-y-auto px-16 pt-24 pb-30'>
      {avatarList.length !== 0 ? (
        <div className='grid grid-cols-3 gap-8'>
          {avatarList.map((avatar) => (
            <button
              key={avatar.id}
              className={`relative w-full p-12 flex flex-col items-center gap-10 bg-[rgba(255,255,255,0.20)] rounded-8 hover:bg-white hover:shadow-floating-primary ${
                avatar.mainCategory === 'accessories'
                  ? selectedAvatar.accessories[avatar.subCategory as SubCategory]?.id === avatar.id
                    ? 'bg-white shadow-floating-primary'
                    : ''
                  : selectedAvatar[avatar.mainCategory]?.id === avatar.id
                    ? 'bg-white shadow-floating-primary'
                    : ''
              }`}
              onClick={() => handleAvatarSelect(avatar)}>
              <div className='relative w-full max-w-80 aspect-square'>
                <Image
                  alt='아바타 파츠'
                  src={Array.isArray(avatar.imageUrl) ? avatar.imageUrl[0] : avatar.imageUrl}
                  loading='lazy'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-contain'
                />
                {/* Skewed New Label */}
                <div className='absolute left-[50%] -translate-x-[50%] bottom-0 h-20 bg-secondary rounded-lg transform -skew-x-[10deg] border-2 border-black-default flex items-center justify-center gap-4 px-8'>
                  <span className='text-12 font-[900]'>NEW</span>
                </div>
              </div>
              <div className='flex gap-2 items-center'>
                <RarityIcon rarity={avatar.rarity} size={16} />
                <span className='text-12 text-black-darken truncate'>{avatar.name}</span>
              </div>

              {/* Info Modal */}
              <div
                className='absolute top-6 right-6'
                onClick={(e) => {
                  e.stopPropagation()
                  openModal({
                    contents: (
                      <DetailModal
                        serialNumber={avatar.id}
                        imageSrc={Array.isArray(avatar.imageUrl) ? avatar.imageUrl[0] : avatar.imageUrl}
                        rarity={avatar.rarity}
                        category={avatar.mainCategory}
                        name={avatar.name}
                      />
                    ),
                  })
                }}>
                <InfoIcon />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <section className='w-full pt-80 text-center text-gray-darkest leading-[24px]'>
          <p>아이템이 없어요.</p>
          <p>도전과제를 달성하고 NFT를 획득하세요!</p>
        </section>
      )}
    </section>
  )
}

function InfoIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <circle cx='12.0002' cy='12' r='9.5' fill={colors.gray.lighten} stroke={colors.gray.default} />
      <path
        d='M11.1859 8.05667C11.1859 7.66556 11.3205 7.35 11.5898 7.11C11.8678 6.87 12.2022 6.75 12.5931 6.75C12.9839 6.75 13.314 6.87 13.5833 7.11C13.8612 7.35 14.0002 7.66556 14.0002 8.05667C14.0002 8.44778 13.8612 8.76333 13.5833 9.00333C13.314 9.24333 12.9839 9.36333 12.5931 9.36333C12.2022 9.36333 11.8678 9.24333 11.5898 9.00333C11.3205 8.76333 11.1859 8.44778 11.1859 8.05667ZM11.0295 11.1167H13.4399L12.4106 17.25H10.0002L11.0295 11.1167Z'
        fill={colors.gray.darkest}
      />
    </svg>
  )
}
