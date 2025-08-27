import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { BottomSheet, Dimmed } from '@shared/Modal'
import { ArrowRightIcon } from '@icons/arrow'
import { MailIcon } from '@icons/mail'
import { BrokenXIcon } from '@icons/x'
import useLogout from '@hooks/useLogout'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import DeleteUserModal from './DeleteUserModal'

export default function SettingModal() {
  const router = useRouter()
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
          <MenuButton
            label='회원 정보 수정'
            rightNode={<ArrowRightIcon size={16} color={colors.black.darken} />}
            onClick={() => {
              router.push('/profile/modify-user')
              closeModal(MODAL_KEY.SETTING)
            }}
          />
          {isApp && (
            <MenuButton
              label='알림 설정'
              rightNode={<ArrowRightIcon size={16} color={colors.black.darken} />}
              onClick={() => {
                router.push('/profile/set-notification')
                closeModal(MODAL_KEY.SETTING)
              }}
            />
          )}
          <MenuButton
            label='개발팀 문의하기'
            rightNode={
              <Link
                href='mailto:devteam@openrun.com'
                className='flex items-center gap-4 rounded-10 border border-gray bg-gray-lighten px-8 py-2 text-12'>
                <span className='text-12'>devteam@openrun.com</span>
                <MailIcon size={16} color={colors.black.darken} />
              </Link>
            }
          />
          <hr className='my-16 border-gray' />
          <MenuButton
            label='로그아웃'
            onClick={() => {
              closeModal(MODAL_KEY.SETTING)
              logout()
            }}
          />
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
  rightNode,
  className,
  onClick,
}: {
  label: string
  rightNode?: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button className={clsx('flex w-full items-center justify-between px-8 py-24', className)} onClick={onClick}>
      <span className='text-14 font-bold'>{label}</span>
      {rightNode}
    </button>
  )
}
