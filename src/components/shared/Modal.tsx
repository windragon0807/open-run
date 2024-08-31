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
    <motion.section
      className='fixed top-0 right-0 left-0 bottom-0 bg-[#000] bg-opacity-60 z-[1000]'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      onClick={closeModal}>
      {/* 전달받은 contents 컴포넌트에 closeModal props로 넘겨주기 */}
      {React.isValidElement(contents) ? React.cloneElement(contents, { closeModal } as any) : contents}
    </motion.section>
  )
}
