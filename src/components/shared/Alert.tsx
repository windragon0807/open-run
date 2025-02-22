'use client'

import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useAlertStore } from '@store/alert'
import { Popup } from './Modal'

export default function AlertPortal() {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  const { isOpen, title, description, closeAlert } = useAlertStore()

  useEffect(() => {
    setPortalRoot(document.getElementById('root-portal'))
  }, [])

  if (!portalRoot) return null

  return createPortal(
    <>
      {isOpen && (
        <section className={`fixed top-0 right-0 left-0 bottom-0 bg-black-darkest/60 z-[2000]`} onClick={closeAlert}>
          <motion.section
            className='w-full h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <Popup>
              <div className='relative w-full flex flex-col justify-between items-center p-16 pt-40'>
                <div className='flex flex-col gap-8 mb-20'>
                  <h5 className='text-20 leading-30 font-bold text-black-darken text-center'>{title}</h5>
                  <p className='text-black-darken text-sm text-center'>{description}</p>
                </div>
                <button
                  className='w-full h-56 bg-white text-black-darken text-base font-bold rounded-8'
                  onClick={closeAlert}>
                  확인
                </button>
              </div>
            </Popup>
          </motion.section>
        </section>
      )}
    </>,
    portalRoot,
  )
}
