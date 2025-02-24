import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { useModalContext } from '@contexts/ModalContext'
import { BungMember } from '@type/bung'
import Checkbox from '@shared/Checkbox'
import { Popup } from '@shared/Modal'
import { useDropoutMember } from '@apis/bungs/dropoutMember/mutation'

export default function ConfirmDropoutModal({ member }: { member: BungMember }) {
  const router = useRouter()
  const { bungId } = useParams<{ bungId: string }>()

  const { closeModal } = useModalContext()
  const [isChecked, setIsChecked] = useState(false)
  const { mutate: dropoutMember } = useDropoutMember()

  const handleDropout = () => {
    dropoutMember(
      { bungId, userId: member.userId },
      {
        onSuccess: () => {
          /* 벙 상세 페이지 서버 컴포넌트 API 호출 업데이트 */
          router.refresh()
          closeModal()
        },
      },
    )
  }

  return (
    <Popup>
      <div className='flex h-254 w-full flex-col items-center justify-between p-16'>
        <div className='mt-24 flex flex-col gap-8'>
          <div className='flex items-center gap-8 self-center'>
            <Image
              className='rounded-4 bg-black-darken'
              src='/temp/nft_detail_2.png'
              alt={`${member.nickname}의 아바타`}
              width={24}
              height={24}
            />
            <span className='text-base font-bold text-black-darken'>{member.nickname}</span>
          </div>
          <h5 className='text-center text-20 font-bold leading-30 text-black-darken'>멤버를 내보낼까요?</h5>
        </div>
        <div className='flex w-full flex-col items-center gap-18'>
          <Checkbox
            checked={isChecked}
            onChange={setIsChecked}
            text={<p className='text-sm font-bold text-black-darken'>이 멤버를 영구적으로 차단할게요</p>}
          />
          <div className='flex w-full gap-8'>
            <button
              className={`h-56 flex-1 rounded-8 bg-pink/20 text-base font-bold text-pink`}
              onClick={handleDropout}>
              내보내기
            </button>
            <button
              className='h-56 flex-1 rounded-8 bg-white text-base font-bold text-black-darken'
              onClick={() => closeModal()}>
              취소
            </button>
          </div>
        </div>
      </div>
    </Popup>
  )
}
