'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ElementType } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { MODAL_KEY } from '@constants/modal'
import CreateBung from '../home/create-bung/CreateBung'

export default function BottomNavigation() {
  const { isApp } = useAppStore()
  const { showModal } = useModal()
  return (
    <footer
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-[999] flex justify-center bg-gradient-bottom-navigation px-16 pt-16',
        isApp ? 'pb-40' : 'pb-24',
      )}>
      <div className='flex h-56 w-full max-w-[328px] items-center justify-between rounded-28 bg-white px-[9px]'>
        <IconLink href='/' Icon={OpenrunIcon} label='홈' />
        <IconLink href='/explore' Icon={ExploreIcon} label='탐색' />
        <button
          className='flex h-full flex-1 items-center justify-center'
          onClick={() => {
            showModal({ key: MODAL_KEY.CREATE_BUNG, component: <CreateBung /> })
          }}>
          <PlusIcon />
        </button>
        <IconLink href='/achievements' Icon={FlagIcon} label='도전과제' />
        <IconLink href='/my' Icon={PersonIcon} label='프로필' />
      </div>
    </footer>
  )
}

function IconLink({ href, Icon, label }: { href: string; Icon: ElementType; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link className='flex h-full flex-1 flex-col items-center justify-center' href={href}>
      <Icon isActive={isActive} />
      <span className={clsx('text-10 font-medium', isActive ? 'text-black-darken' : 'text-gray')}>{label}</span>
    </Link>
  )
}

function OpenrunIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <path
        className={isActive ? 'fill-black-darken' : 'fill-gray'}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.7857 20H0V17.8667H14.7857C18.1126 17.8667 20.8095 15.2401 20.8095 12C20.8095 8.75993 18.1126 6.13333 14.7857 6.13333H9.30952C5.98267 6.13333 3.28571 8.75993 3.28571 12C3.28571 12.5547 3.36475 13.0914 3.51246 13.6H5.84508C5.60854 13.1151 5.47619 12.5726 5.47619 12C5.47619 9.93814 7.19243 8.26667 9.30952 8.26667H14.7857C16.9028 8.26667 18.619 9.93814 18.619 12C18.619 14.0619 16.9028 15.7333 14.7857 15.7333H2.04267C1.68358 15.0717 1.41695 14.3552 1.25955 13.6C1.1518 13.083 1.09524 12.5479 1.09524 12C1.09524 7.58172 4.7729 4 9.30952 4H14.7857C19.3223 4 23 7.58172 23 12C23 16.4183 19.3223 20 14.7857 20ZM14.7857 13.6H9.30952C8.4022 13.6 7.66667 12.8837 7.66667 12C7.66667 11.1163 8.4022 10.4 9.30952 10.4H14.7857C15.693 10.4 16.4286 11.1163 16.4286 12C16.4286 12.8837 15.693 13.6 14.7857 13.6Z'
      />
    </svg>
  )
}

function ExploreIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <mask className='fill-white' id='path-1-inside-1_1376_2804'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M14.2143 13.7858L15.7383 7.18166L9.13415 8.7057L9.13444 8.70599L7.61042 15.3101L14.2146 13.7861L14.2143 13.7858Z'
        />
      </mask>
      <path
        className={isActive ? 'fill-black-darken' : 'fill-gray'}
        d='M15.7383 7.18166L17.6871 7.63138L18.4066 4.51333L15.2886 5.23288L15.7383 7.18166ZM14.2143 13.7858L12.2655 13.3361L12.0162 14.4162L12.8001 15.2L14.2143 13.7858ZM9.13415 8.7057L8.68443 6.75691L5.16834 7.56832L7.71993 10.1199L9.13415 8.7057ZM9.13444 8.70599L11.0832 9.15571L11.3325 8.0756L10.5487 7.29178L9.13444 8.70599ZM7.61042 15.3101L5.66164 14.8604L4.94209 17.9784L8.06014 17.2589L7.61042 15.3101ZM14.2146 13.7861L14.6643 15.7349L18.1804 14.9234L15.6288 12.3719L14.2146 13.7861ZM13.7895 6.73194L12.2655 13.3361L16.1631 14.2355L17.6871 7.63138L13.7895 6.73194ZM9.58387 10.6545L16.188 9.13044L15.2886 5.23288L8.68443 6.75691L9.58387 10.6545ZM10.5487 7.29178L10.5484 7.29148L7.71993 10.1199L7.72023 10.1202L10.5487 7.29178ZM7.18566 8.25627L5.66164 14.8604L9.5592 15.7598L11.0832 9.15571L7.18566 8.25627ZM8.06014 17.2589L14.6643 15.7349L13.7649 11.8373L7.1607 13.3613L8.06014 17.2589ZM15.6288 12.3719L15.6285 12.3716L12.8001 15.2L12.8004 15.2003L15.6288 12.3719Z'
        mask='url(#path-1-inside-1_1376_2804)'
      />
      <path
        className={isActive ? 'fill-black-darken' : 'fill-gray'}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5 11V15H3V11C3 6.02944 7.02944 2 12 2C16.9706 2 21 6.02944 21 11C21 15.9706 16.9706 20 12 20H5H3V18H5H6H12C15.866 18 19 14.866 19 11C19 7.13401 15.866 4 12 4C8.13401 4 5 7.13401 5 11Z'
      />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width='36' height='36' viewBox='0 0 36 36'>
      <rect width='36' height='36' rx='18' fill='#F8F9FA' />
      <path
        className='fill-gray-darken'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19 10V17H26V19H19V26H17V24L17 19V17L17 13L17 10H19ZM14 17H10V19H14V17Z'
      />
    </svg>
  )
}

function FlagIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <path
        className={isActive ? 'fill-black-darken' : 'fill-gray'}
        d='M14.4288 5.925L9.71453 4L5.00024 6.8L6.00024 18L7.88134 16.9198L7.63283 13.7959L7.10431 7.87648L9.88001 6.22788L14.2784 8.02387L18.8458 6.88413L17.3069 10.7592L19.6416 13.9768L15.402 15.0347L10.3888 13.1738L10.3867 13.1749L10.5567 15.3836L10.5717 15.375L15.286 17.125L23.0002 15.2L19.5717 10.475L22.1431 4L14.4288 5.925Z'
      />
      <path
        className={isActive ? 'fill-black-darken' : 'fill-gray'}
        d='M2.70085 21.9932L4.69324 21.8189L3.3859 6.87593C3.33777 6.32575 2.85274 5.91876 2.30255 5.96689C1.75237 6.01503 1.34538 6.50006 1.39351 7.05024L2.70085 21.9932Z'
      />
    </svg>
  )
}

function PersonIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <rect
        className={isActive ? 'fill-black-darken' : 'fill-gray'}
        x='1'
        y='-1'
        width='4'
        height='5'
        rx='2'
        transform='matrix(1 0 0 -1 9 8)'
        strokeWidth='2'
      />
      <path
        className={isActive ? 'fill-black-darken' : 'fill-gray'}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4 20C4 19.6613 4.02104 19.3276 4.06189 19H6.08296H7H17.917C17.441 16.1623 14.973 14 12 14C9.77915 14 7.84012 15.2066 6.80269 17H4.58152C5.76829 14.0682 8.64262 12 12 12C16.0796 12 19.446 15.0537 19.9381 19C19.979 19.3276 20 19.6613 20 20V21H18H6H4V20Z'
      />
    </svg>
  )
}
