import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BottomSheet } from '@shared/Modal'
import BrokenXIcon from '@icons/BrokenXIcon'
import { useModalContext } from '@contexts/ModalContext'
import { colors } from '@styles/colors'
import { BungMember } from '@type/bung'
import { useSendMemberLike } from '@apis/bungs/sendMemberLike/mutation'

export default function BungCompleteModal({
  imageUrl,
  title,
  location,
  memberList,
}: {
  imageUrl: string
  title: string
  location: string
  memberList: BungMember[]
}) {
  const router = useRouter()
  const { closeModal } = useModalContext()
  const { mutate: sendMemberLike } = useSendMemberLike()

  const [checkedUserIdList, setCheckedUserIdList] = useState<string[]>([])

  const handleSaveButton = () => {
    if (checkedUserIdList.length === 0) {
      closeModal()
    }

    sendMemberLike(
      { targetUserIds: checkedUserIdList },
      {
        onSuccess: () => {
          /* 자기 자신에게 좋아요를 눌렀을 경우, 메인 페이지에서의 좋아요 갯수 업데이트 */
          router.refresh()
          closeModal()
        },
      },
    )
  }

  return (
    <BottomSheet fullSize>
      <header className='relative flex w-full h-60 justify-center items-center px-16 mb-16'>
        <button className='absolute left-16' onClick={closeModal}>
          <BrokenXIcon size={24} color={colors.black.default} />
        </button>
        <span className='text-base font-bold'>벙 완료!</span>
        <button className='absolute right-16' onClick={handleSaveButton}>
          <span className='text-sm text-black-darken'>저장</span>
        </button>
      </header>

      <section className='h-[calc(100%-110px)] overflow-y-auto px-16'>
        <div className='flex flex-col items-center gap-8 text-center mb-40'>
          <h1 className='text-20 font-bold leading-normal'>
            함께 달렸던 멤버들에게
            <br />
            <ThumbUpIcon status='default' /> 를 남겨보세요
          </h1>
          <p className='text-sm text-black-darken'>좋아요를 남긴 멤버의 인기도가 올라갑니다</p>
        </div>

        <div className='w-full flex items-center gap-16 p-16 shadow-floating-primary rounded-8 mb-40'>
          <Image
            className='object-cover rounded-8 aspect-[76/56]'
            src={imageUrl}
            alt='bung-image'
            width={76}
            height={56}
          />
          <div className='flex flex-col gap-4'>
            <p className='text-base text-black-darken font-bold whitespace-wrap'>{title}</p>
            <div className='flex items-center gap-4'>
              <LocationIcon />
              <span className='text-sm text-black-darken whitespace-wrap'>{location}</span>
            </div>
          </div>
        </div>

        <ul className='flex flex-col gap-16 h-[calc(100%-230px)] overflow-y-auto pb-40'>
          {memberList.map((member) => (
            <li key={member.userId} className='flex justify-between items-center gap-8'>
              <div className='flex items-center gap-16'>
                <Image
                  className='bg-black-darken rounded-8'
                  src='/temp/nft_detail_2.png'
                  alt={`${member.nickname}의 아바타`}
                  width={76}
                  height={76}
                />
                <div className='flex items-center gap-4'>
                  <span className='text-sm font-bold text-black-darken'>{member.nickname}</span>
                  {member.owner && <Image src='/images/icon_crown.png' alt='Crown Icon' width={16} height={18} />}
                </div>
              </div>

              <button
                onClick={() => {
                  setCheckedUserIdList((prev) =>
                    checkedUserIdList.includes(member.userId)
                      ? prev.filter((id) => id !== member.userId)
                      : [...prev, member.userId],
                  )
                }}>
                <ThumbUpIcon status={checkedUserIdList.includes(member.userId) ? 'checked' : 'unchecked'} />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </BottomSheet>
  )
}

function ThumbUpIcon({ status }: { status: 'default' | 'unchecked' | 'checked' }) {
  const fill = status === 'default' ? colors.black.darken : colors.primary
  return (
    <svg className='inline -translate-y-[2px]' width='24' height='24' viewBox='0 0 24 24' fill='none'>
      {status !== 'unchecked' ? (
        <>
          <mask id='path-1-inside-1_836_2245' fill='white'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M16 5.375L15.3556 9H22V14.5L19.1875 22H8V8.1875L10 5.375L11 2H16V5.375ZM6 9H2V22H6V9Z'
            />
          </mask>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M16 5.375L15.3556 9H22V14.5L19.1875 22H8V8.1875L10 5.375L11 2H16V5.375ZM6 9H2V22H6V9Z'
            fill={fill}
          />
          <path
            d='M15.3556 9L13.3864 8.64993L12.9686 11H15.3556V9ZM16 5.375L17.9691 5.72507L18 5.55139V5.375H16ZM22 9H24V7H22V9ZM22 14.5L23.8727 15.2022L24 14.8627V14.5H22ZM19.1875 22V24H20.5735L21.0602 22.7022L19.1875 22ZM8 22H6V24H8V22ZM8 8.1875L6.37009 7.02845L6 7.54889V8.1875H8ZM10 5.375L11.6299 6.53405L11.823 6.26257L11.9176 5.94318L10 5.375ZM11 2V0H9.50665L9.0824 1.43182L11 2ZM16 2H18V0H16V2ZM6 9H8V7H6V9ZM2 9V7H0V9H2ZM2 22H0V24H2V22ZM6 22V24H8V22H6ZM17.3247 9.35007L17.9691 5.72507L14.0309 5.02493L13.3864 8.64993L17.3247 9.35007ZM22 7H15.3556V11H22V7ZM24 14.5V9H20V14.5H24ZM21.0602 22.7022L23.8727 15.2022L20.1273 13.7978L17.3148 21.2978L21.0602 22.7022ZM8 24H19.1875V20H8V24ZM10 22V8.1875H6V22H10ZM8.37009 4.21595L6.37009 7.02845L9.62991 9.34655L11.6299 6.53405L8.37009 4.21595ZM9.0824 1.43182L8.0824 4.80682L11.9176 5.94318L12.9176 2.56818L9.0824 1.43182ZM16 0H11V4H16V0ZM18 5.375V2H14V5.375H18ZM6 7H2V11H6V7ZM0 9V22H4V9H0ZM2 24H6V20H2V24ZM4 9V22H8V9H4Z'
            fill={fill}
            mask='url(#path-1-inside-1_836_2245)'
          />
        </>
      ) : (
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M7.42222 9H7H4H2V11V20V22H4V20V11H6H7V11.7111V13V20V22H9H19.1875L22 14.5V11V9H20H17.3869H15.3556L15.7111 7L16 5.375V4V2H14H11L10 5.375L7.42222 9ZM17.8015 20H9V11V10.2324L9.05213 10.159L11.6299 6.53405L11.823 6.26257L11.9176 5.94318L12.4934 4H14V5.19861L13.3864 8.64993L12.9686 11H15.3556H20V14.1373L17.8015 20Z'
          fill={colors.gray.darken}
        />
      )}
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg
      className='fill-black-darken shrink-0 self-start translate-y-[2px]'
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8 15L3.75736 11.2426C1.41421 8.89949 1.41421 5.1005 3.75736 2.75736C6.1005 0.414214 9.89949 0.414214 12.2426 2.75736C14.5858 5.1005 14.5858 8.89949 12.2426 11.2426L8 15ZM8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7C10 8.10457 9.10457 9 8 9Z'
      />
    </svg>
  )
}
