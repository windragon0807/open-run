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
    <section className={`fixed top-0 right-0 left-0 bottom-0 bg-[#000] bg-opacity-60 z-[1000]`} onClick={onClick}>
      <motion.section
        className='w-full h-full'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}>
        {children}
      </motion.section>
    </section>
  )
}

export function BottomSheet({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ y: '50%' }}
      animate={{ y: '7%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='fixed bottom-0 left-0 w-full h-full bg-gray-lighten shadow-lg rounded-t-2xl'
      onClick={(e) => e.stopPropagation()}>
      {children}
    </motion.div>
  )
}
