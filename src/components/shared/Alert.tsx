'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
        <section className={`fixed bottom-0 left-0 right-0 top-0 z-[2000] bg-black-darkest/60`} onClick={closeAlert}>
          <motion.section
            className='h-full w-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <Popup>
              <div className='relative flex w-full flex-col items-center justify-between p-16 pt-40'>
                <div className='mb-20 flex flex-col gap-8'>
                  <h5 className='text-center text-20 font-bold text-black-darken'>{title}</h5>
                  <p className='text-center text-14 text-black-darken'>{description}</p>
                </div>
                <button
                  className='h-56 w-full rounded-8 bg-white text-16 font-bold text-black-darken'
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
