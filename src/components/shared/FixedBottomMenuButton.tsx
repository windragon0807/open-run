'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import FilledBellIcon from '@icons/FilledBellIcon'
import OpenrunIcon from '@icons/OpenrunIcon'
import PersonIcon from '@icons/PersonIcon'
import { ROOT_PORTAL_ID } from '@constants/layout'
import { colors } from '@styles/colors'

export default function FixedBottomMenuButton() {
  const [isDimmed, setDimmed] = useState(false)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalRoot(document.getElementById(ROOT_PORTAL_ID))
  }, [])

  if (portalRoot == null) {
    return null
  }

  const toggleMenu = () => {
    setDimmed((prev) => !prev)
  }

  return createPortal(
    <>
      {/* Dimmed background */}
      <AnimatePresence>
        {isDimmed && (
          <motion.div
            className={`fixed inset-0 z-[999] bg-black-darkest/60`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Button and expanding menu */}
      <motion.div
        className='fixed bottom-26 left-0 right-0 z-[1000]'
        initial={{ width: 96, marginLeft: 'auto', marginRight: 'auto' }}
        animate={
          isDimmed
            ? { width: 'calc(100% - 32px)', marginLeft: '0', marginRight: '0' }
            : { width: 96, marginLeft: 'auto', marginRight: 'auto' }
        }
        transition={{ duration: 0.2, ease: 'easeInOut' }}>
        <div className='h-56 w-full cursor-pointer' onClick={toggleMenu}>
          {isDimmed ? (
            <MenuBar />
          ) : (
            <div className='rounded-32 flex h-full w-full items-center justify-center bg-white shadow-floating-primary'>
              <Dots />
            </div>
          )}
        </div>
      </motion.div>
    </>,
    portalRoot,
  )
}

function MenuBar() {
  return (
    <div className={`rounded-32 flex h-full w-full items-center bg-white/20`} style={{ backdropFilter: 'blur(3px)' }}>
      <Link href='/' className='rounded-32 flex h-full w-[36%] items-center justify-center gap-20 bg-white'>
        <OpenrunIcon size={24} color={colors.black.darken} />
        <span className='text-14 font-semibold'>홈</span>
      </Link>
      <div className='flex flex-1 justify-around'>
        <Image src='/images/icon_explorer.png' alt='' width={24} height={24} />
        <FilledBellIcon size={24} color={colors.white} />
        <PersonIcon size={24} color={colors.white} />
      </div>
    </div>
  )
}

function Dots() {
  const color = colors.black.darken
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <circle cx='7' cy='7' r='3' fill={color} />
      <circle cx='17' cy='7' r='3' fill={color} />
      <circle cx='7' cy='17' r='3' fill={color} />
      <circle cx='17' cy='17' r='3' fill={color} />
    </svg>
  )
}
