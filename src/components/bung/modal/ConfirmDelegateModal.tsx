import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useMutation } from 'react-query'
import { useModalContext } from '@contexts/ModalContext'
import { BungMember } from '@type/bung'
import { delegateOwner as _delegateOwner } from '@apis/bungs/delegateOwner/api'
import { Popup } from '@shared/Modal'

export default function ConfirmDelegateModal({ member, onSuccess }: { member: BungMember; onSuccess: () => void }) {
  const router = useRouter()
  const { bungId } = useParams<{ bungId: string }>()

  const { closeModal } = useModalContext()

  const { mutate: delegateOwner } = useMutation(_delegateOwner)
  const handleDelegate = () => {
    delegateOwner(
      { bungId, newOwnerUserId: member.userId },
      {
        onSuccess: () => {
          /* 벙 상세 페이지 서버 컴포넌트 API 호출 업데이트 */
          router.refresh()
          closeModal()
          onSuccess()
        },
      },
    )
  }

  return (
    <Popup>
      <div className='w-full h-214 flex flex-col justify-between items-center p-16'>
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
          <h5 className='text-20 leading-30 font-bold text-black-darken text-center'>멤버에게 벙주 넘기기</h5>
        </div>
        <div className='w-full flex gap-8'>
          <button
            className={`flex-1 h-56 bg-black-darkest text-white text-base font-bold rounded-8`}
            onClick={handleDelegate}>
            확인
          </button>
          <button
            className='flex-1 h-56 bg-white text-black-darken text-base font-bold rounded-8'
            onClick={() => closeModal()}>
            취소
          </button>
        </div>
      </div>
    </Popup>
  )
}
