import clsx from 'clsx'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { BottomSheet, Dimmed } from '@shared/Modal'
import BrokenXIcon from '@icons/BrokenXIcon'
import useLogout from '@hooks/useLogout'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import DeleteUserModal from './DeleteUserModal'

export default function SettingModal() {
  const { closeModal, showModal } = useModal()
  const { logout } = useLogout()
  const { isApp } = useAppStore()

  return (
    <Dimmed onClick={() => closeModal(MODAL_KEY.SETTING)}>
      <BottomSheet>
        <header className='mb-16 flex h-60 w-full items-center justify-center'>
          <button className='absolute left-16' onClick={() => closeModal(MODAL_KEY.SETTING)}>
            <BrokenXIcon size={24} color={colors.black.DEFAULT} />
          </button>
          <span className='text-16 font-bold text-black-darken'>설정</span>
        </header>

        <section className={clsx('px-16', isApp ? 'pb-40' : 'pb-16')}>
          <MenuButton label='회원 정보 수정' arrow />
          <MenuButton label='알림 설정' arrow />
          <MenuButton label='고객지원' arrow />
          <hr className='my-16 border-gray' />
          <MenuButton label='로그아웃' onClick={logout} />
          <MenuButton
            className='text-pink'
            label='계정 탈퇴'
            onClick={() =>
              showModal({
                key: MODAL_KEY.DELETE_USER,
                component: <DeleteUserModal />,
              })
            }
          />
        </section>
      </BottomSheet>
    </Dimmed>
  )
}

function MenuButton({
  label,
  arrow = false,
  className,
  onClick,
}: {
  label: string
  arrow?: boolean
  className?: string
  onClick?: () => void
}) {
  return (
    <button className={clsx('flex w-full items-center justify-between px-8 py-24', className)} onClick={onClick}>
      <span className='text-14 font-bold'>{label}</span>
      {arrow && (
        <svg width='16' height='16' viewBox='0 0 16 16'>
          <path
            className='fill-black-darken'
            d='M8.39992 8L5.33325 4.93333L6.26659 4L10.2666 8L6.26659 12L5.33325 11.0667L8.39992 8Z'
          />
        </svg>
      )}
    </button>
  )
}
