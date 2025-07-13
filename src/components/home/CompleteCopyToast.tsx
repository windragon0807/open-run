import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { MODAL_KEY } from '@constants/modal'

export default function CompleteCopyToast() {
  const { isApp } = useAppStore()
  const [isOpen, setIsOpen] = useState(true)
  const { closeModal } = useModal()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleExitComplete = () => {
    closeModal(MODAL_KEY.COMPLETE_COPY_TOAST)
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <motion.div
          className={clsx(
            'z-modal fixed left-0 right-0 mx-auto h-[56px] rounded-16 px-16',
            isApp ? 'bottom-40' : 'bottom-24',
          )}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}>
          <div className='mx-auto flex h-[56px] max-w-[328px] items-center justify-between rounded-16 bg-gray-darker/80 px-16 backdrop-blur-[10px]'>
            <div className='flex items-center gap-8'>
              <div className='h-16 w-16 rounded-full bg-secondary'>
                <svg width={16} height={16} viewBox='0 0 16 16'>
                  <rect
                    className='fill-gray-darker'
                    x='5.88562'
                    y='10.875'
                    width='8'
                    height='1.33333'
                    transform='rotate(-45 5.88562 10.875)'
                  />
                  <rect
                    className='fill-gray-darker'
                    x='4.27628'
                    y='7.38086'
                    width='4.66667'
                    height='1.33333'
                    transform='rotate(45 4.27628 7.38086)'
                  />
                </svg>
              </div>
              <span className='text-16 font-bold text-white'>주소가 복사되었습니다.</span>
            </div>
            <button onClick={handleExitComplete}>
              <svg width={24} height={24} viewBox='0 0 24 24'>
                <path
                  className='fill-white'
                  d='M13.4142 12.0002L18.364 16.95L16.9497 18.3642L12 13.4144L7.05025 18.3642L5.63604 16.95L16.9497 5.63627L18.364 7.05048L13.4142 12.0002ZM8.46447 9.87891L5.63604 7.05048L7.05025 5.63627L9.87868 8.4647L8.46447 9.87891Z'
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
