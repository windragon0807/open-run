import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useMutation } from 'react-query'
import { useModalContext } from '@contexts/ModalContext'
import { BungDetailMember } from '@/types/bung'
import { delegateOwner as _delegateOwner } from '@apis/bungs/delegateOwner/api'

export default function ConfirmDelegateModal({
  member,
  onSuccess,
}: {
  member: BungDetailMember
  onSuccess: () => void
}) {
  const router = useRouter()
  const { bungId } = useParams<{ bungId: string }>()

  const { closeModal } = useModalContext()

  const { mutate: delegateOwner } = useMutation(_delegateOwner)
  const handleDelegate = () => {
    delegateOwner(
      { bungId, newOwnerUserId: member.userId },
      {
        onSuccess: () => {
          router.refresh()
          closeModal()
          onSuccess()
        },
      },
    )
  }

  return (
    <section
      className='absolute w-[calc(100%-32px)] max-w-[328px] h-230 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-16 p-16'
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
          <h5 className='text-20 leading-30 font-bold text-black-darken text-center'>멤버에게 벙주를 양도할까요?</h5>
        </div>
        <div className='w-full flex gap-8'>
          <button
            className={`flex-1 h-56 bg-black-darkest text-white text-base font-bold rounded-8`}
            onClick={handleDelegate}>
            양도하기
          </button>
          <button
            className='flex-1 h-56 bg-white text-black-darken text-base font-bold rounded-8'
            onClick={() => closeModal()}>
            취소
          </button>
        </div>
      </div>
    </section>
  )
}
