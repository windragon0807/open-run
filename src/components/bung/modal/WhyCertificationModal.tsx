import { useModalContext } from '@contexts/ModalContext'
import CloseIcon from '@icons/CloseIcon'

export default function WhyCertificationModal() {
  const { closeModal } = useModalContext()
  return (
    <section
      className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[328px] h-[70%] bg-white rounded-8'
      onClick={(e) => e.stopPropagation()}>
      <div className='w-full h-full'>
        <header className='relative w-full h-60 flex items-center justify-center'>
          <h3 className='text-16 font-bold text-black-darken'>참여 인증을 왜 해야 하나요?</h3>
          <button className='absolute right-16' onClick={closeModal}>
            <CloseIcon size={24} />
          </button>
        </header>
      </div>
    </section>
  )
}
