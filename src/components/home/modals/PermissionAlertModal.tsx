import { Popup } from '@shared/Modal'
import { useModalContext } from '@contexts/ModalContext'
import BrokenXIcon from '@icons/BrokenXIcon'
import { colors } from '@styles/colors'

export default function PermissionAlertModal() {
  const { closeModal } = useModalContext()
  return (
    <Popup>
      <div className='relative w-full flex flex-col justify-between items-center p-16 pt-40'>
        <button className='absolute top-16 right-16' onClick={closeModal}>
          <BrokenXIcon size={24} color={colors.black.darken} />
        </button>
        <div className='flex flex-col gap-8 mb-20'>
          <h5 className='text-20 leading-30 font-bold text-black-darken text-center'>서비스 접근 권한 안내</h5>
          <p className='text-black-darken text-sm text-center'>{`위치 권한 사용을 거부하였습니다. 기능 사용을 원하실 경우 휴대폰설정 > 애플리케이션 관리자에서 해당 앱의 권한을 허용해주세요.`}</p>
        </div>
      </div>
    </Popup>
  )
}
