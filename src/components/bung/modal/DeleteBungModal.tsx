import { useRouter } from 'next/navigation'
import { useModalContext } from '@contexts/ModalContext'
import { Popup } from '@shared/Modal'
import { useRefetchQuery } from '@hooks/useRefetchQuery'
import { queryKey } from '@apis/bungs/fetchMyBungs/query'
import { useDeleteBung } from '@apis/bungs/deleteBung/mutation'

export default function DeleteBungModal({ bungId }: { bungId: string }) {
  const router = useRouter()
  const { closeModal } = useModalContext()
  const 메인페이지벙리스트업데이트 = useRefetchQuery(queryKey)
  const { mutate: deleteBung } = useDeleteBung()

  const handleDeleteBung = () => {
    deleteBung(
      { bungId },
      {
        onSuccess: () => {
          메인페이지벙리스트업데이트()
          closeModal()
          router.replace('/')
        },
      },
    )
  }

  return (
    <Popup>
      <div className='flex h-230 w-full flex-col items-center justify-between p-16'>
        <div className='mt-24 flex flex-col gap-8'>
          <h5 className='text-center text-20 font-bold leading-30 text-black-darken'>벙 삭제하기</h5>
          <p className='text-center text-sm text-black-darken'>
            삭제한 벙은 복구할 수 없습니다. <br />
            벙을 삭제하시겠습니까?
          </p>
        </div>
        <div className='flex w-full gap-8'>
          <button
            className={`h-56 flex-1 rounded-8 bg-pink/20 text-base font-bold text-pink`}
            onClick={handleDeleteBung}>
            삭제
          </button>
          <button className='h-56 flex-1 rounded-8 bg-white text-base font-bold text-black-darken' onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </Popup>
  )
}
