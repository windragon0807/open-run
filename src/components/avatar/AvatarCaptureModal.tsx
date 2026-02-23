import Image from 'next/image'
import { useRef } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import { BrokenXIcon } from '@icons/x'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'

export default function AvatarCaptureModal({ imgData }: { imgData: string }) {
  const { closeModal } = useModal()
  const sheetRef = useRef<BottomSheetRef>(null)
  const handleClose = () => sheetRef.current?.close()

  const downloadImage = () => {
    const link = document.createElement('a')
    link.download = 'avatar-capture.png'
    link.href = imgData
    link.click()
  }

  return (
    <Dimmed onClick={handleClose}>
      <BottomSheet ref={sheetRef} onClose={() => closeModal(MODAL_KEY.AVATAR_CAPTURE)}>
        <header className='flex h-60 w-full items-center justify-center'>
          <button className='absolute right-16' onClick={handleClose}>
            <BrokenXIcon size={24} color={colors.black.DEFAULT} />
          </button>
          <span className='text-16 font-bold text-black-darken'>아바타 캡쳐</span>
        </header>
        <section className='flex h-full w-full flex-col items-center justify-center gap-24 px-24 pt-20 pb-40 app:pb-50'>
          <div className='relative flex aspect-square w-216 flex-col items-center justify-center rounded-10 border border-gray-darken'>
            <Image src={imgData} alt='아바타 캡쳐' fill className='absolute object-contain' />
            <div className='absolute bottom-0 left-0 right-0 top-0 rounded-[50%] border border-primary/50' />
          </div>

          <button
            className='h-[60px] w-full rounded-10 bg-primary text-16 font-semibold text-white'
            onClick={downloadImage}>
            이미지 다운로드
          </button>
        </section>
      </BottomSheet>
    </Dimmed>
  )
}
