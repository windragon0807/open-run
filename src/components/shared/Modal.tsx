import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

export default function Modal({
  isOpen,
  contents,
  closeModal,
}: {
  isOpen: boolean
  contents: ReactNode
  closeModal: () => void
}) {
  if (isOpen === false) return null

  return (
    <ModalDimmed onClick={closeModal}>
      {/* 전달받은 contents 컴포넌트에 closeModal props로 넘겨주기 */}
      {React.isValidElement(contents) ? React.cloneElement(contents, { closeModal } as any) : contents}
    </ModalDimmed>
  )
}

function ModalDimmed({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <section className={`fixed bottom-0 left-0 right-0 top-0 z-[1000] bg-black-darkest/60`} onClick={onClick}>
      <motion.section
        className='h-full w-full'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}>
        {children}
      </motion.section>
    </section>
  )
}

export function BottomSheet({
  children,
  fullSize,
  className,
}: {
  children: ReactNode
  fullSize?: boolean
  className?: string
}) {
  return (
    <motion.div
      initial={{ y: '50%' }}
      animate={{ y: fullSize ? '7%' : '0%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed bottom-0 left-0 w-full rounded-t-2xl bg-gray-lighten shadow-lg ${fullSize ? 'h-full' : ''} ${className}`}
      onClick={(e) => e.stopPropagation()}>
      {children}
    </motion.div>
  )
}

export function Popup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ y: '-30%', x: '-50%' }}
      animate={{ y: '-50%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed left-1/2 top-1/2 w-[calc(100%-32px)] max-w-[328px] rounded-16 bg-white ${className}`}
      onClick={(e) => e.stopPropagation()}>
      {children}
    </motion.div>
  )
}
