import { useRouter } from 'next/navigation'
import { useMutation } from 'react-query'
import { deleteBung as _deleteBung } from '@apis/bungs/deleteBung/api'
import { useModalContext } from '@contexts/ModalContext'
import { Popup } from '@shared/Modal'

export default function DeleteBungModal({ bungId }: { bungId: string }) {
  const router = useRouter()
  const { closeModal } = useModalContext()

  const { mutate: deleteBung } = useMutation(_deleteBung)
  const handleDeleteBung = () => {
    deleteBung(
      { bungId },
      {
        onSuccess: () => {
          closeModal()
          router.refresh()
          router.replace('/')
        },
      },
    )
  }

  return (
    <Popup>
      <div className='w-full h-230 flex flex-col justify-between items-center p-16'>
        <div className='flex flex-col gap-8 mt-24'>
          <h5 className='text-20 leading-30 font-bold text-black-darken text-center'>벙 삭제하기</h5>
          <p className='text-black-darken text-sm text-center'>
            삭제한 벙은 복구할 수 없습니다. <br />
            벙을 삭제하시겠습니까?
          </p>
        </div>
        <div className='w-full flex gap-8'>
          <button
            className={`flex-1 h-56 bg-[#F06595] bg-opacity-20 text-pink-default text-base font-bold rounded-8`}
            onClick={handleDeleteBung}>
            삭제
          </button>
          <button className='flex-1 h-56 bg-white text-black-darken text-base font-bold rounded-8' onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </Popup>
  )
}
