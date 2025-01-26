import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { deleteBung as _deleteBung } from '@apis/bungs/deleteBung/api'
import { useModalContext } from '@contexts/ModalContext'
import { BungDetailMember } from '@/types/bung'
import Checkbox from '@shared/Checkbox'
import { dropoutMember as _dropoutMember } from '@apis/bungs/dropoutMember/api'

export default function ConfirmDropoutModal({ member }: { member: BungDetailMember }) {
  const router = useRouter()
  const { bungId } = useParams<{ bungId: string }>()

  const { closeModal } = useModalContext()
  const [isChecked, setIsChecked] = useState(false)

  const { mutate: dropoutMember } = useMutation(_dropoutMember)
  const handleDropout = () => {
    dropoutMember(
      { bungId, userId: member.userId },
      {
        onSuccess: () => {
          router.refresh()
          closeModal()
        },
      },
    )
  }

  return (
    <section
      className='absolute w-[calc(100%-32px)] max-w-[328px] h-254 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-16 p-16'
      onClick={(e) => e.stopPropagation()}>
      <div className='w-full h-full flex flex-col justify-between items-center'>
        <div className='flex flex-col gap-8 mt-24'>
          <div className='flex items-center self-center gap-8'>
            <Image
              className='bg-black-darken rounded-4'
              src='/temp/nft_detail_2.png'
              alt={`${member.nickname}의 아바타`}
              width={24}
              height={24}
            />
            <span className='text-base font-bold text-black-darken'>{member.nickname}</span>
          </div>
          <h5 className='text-20 leading-30 font-bold text-black-darken text-center'>멤버를 내보낼까요?</h5>
        </div>
        <div className='w-full flex flex-col gap-18 items-center'>
          <Checkbox
            checked={isChecked}
            onChange={setIsChecked}
            text={<p className='text-sm font-bold text-black-darken'>이 멤버를 영구적으로 차단할게요</p>}
          />
          <div className='w-full flex gap-8'>
            <button
              className={`flex-1 h-56 bg-[#F06595] bg-opacity-20 text-pink-default text-base font-bold rounded-8`}
              onClick={handleDropout}>
              내보내기
            </button>
            <button
              className='flex-1 h-56 bg-white text-black-darken text-base font-bold rounded-8'
              onClick={() => closeModal()}>
              취소
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
