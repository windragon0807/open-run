import { useModalContext } from '@contexts/ModalContext'
import { Popup } from '@shared/Modal'

export default function PermissionAlertModal() {
  const { closeModal } = useModalContext()
  return (
    <Popup>
      <div className='w-full h-200 flex flex-col justify-between items-center p-16'>
        <div className='flex flex-col gap-8 mt-24'>
          <h5 className='text-20 leading-30 font-bold text-black-darken text-center'>위치 권한 확인</h5>
          <p className='text-black-darken text-sm text-center'>위치 권한을 확인해주세요</p>
        </div>
        <div className='w-full flex gap-8'>
          <button className='flex-1 h-56 bg-white text-black-darken text-base font-bold rounded-8' onClick={closeModal}>
            확인
          </button>
        </div>
      </div>
    </Popup>
  )
}
