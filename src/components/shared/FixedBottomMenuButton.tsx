'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

import PersonIcon from '@icons/PersonIcon'
import OpenrunIcon from '@icons/OpenrunIcon'
import FilledBellIcon from '@icons/FilledBellIcon'
import { colors } from '@styles/colors'

export default function FixedBottomMenuButton() {
  const [isDimmed, setDimmed] = useState(false)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalRoot(document.getElementById('root-portal'))
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
            className={`fixed inset-0 bg-[#000] bg-opacity-60 z-[999]`}
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
        className='fixed left-0 right-0 bottom-26 z-[1000]'
        initial={{ width: 96, marginLeft: 'auto', marginRight: 'auto' }}
        animate={
          isDimmed
            ? { width: 'calc(100% - 32px)', marginLeft: '0', marginRight: '0' }
            : { width: 96, marginLeft: 'auto', marginRight: 'auto' }
        }
        transition={{ duration: 0.2, ease: 'easeInOut' }}>
        <div className='w-full h-56 cursor-pointer' onClick={toggleMenu}>
          {isDimmed ? (
            <MenuBar />
          ) : (
            <div className='w-full h-full bg-white rounded-[32px] shadow-floating-primary flex items-center justify-center'>
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
    <div
      className={`w-full h-full flex items-center rounded-[32px] bg-[#fff] bg-opacity-20`}
      style={{ backdropFilter: 'blur(3px)' }}>
      <Link href='/' className='w-[36%] h-full rounded-[32px] bg-white flex items-center justify-center gap-20'>
        <OpenrunIcon size={24} color={colors.black.darken} />
        <span className='text-[14px] leading-[20px] font-semibold'>홈</span>
      </Link>
      <div className='flex-1 flex justify-around'>
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
