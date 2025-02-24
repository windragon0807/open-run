import { useModalContext } from '@contexts/ModalContext'
import BrokenXIcon from '@icons/BrokenXIcon'
import { colors } from '@styles/colors'

export default function WhyCertificationModal() {
  const { closeModal } = useModalContext()
  return (
    <section
      className='absolute left-1/2 top-1/2 h-[70%] w-[90%] max-w-[328px] -translate-x-1/2 -translate-y-1/2 rounded-8 bg-white'
      onClick={(e) => e.stopPropagation()}>
      <div className='h-full w-full'>
        <header className='relative flex h-60 w-full items-center justify-center'>
          <h3 className='text-16 font-bold text-black-darken'>참여 인증을 왜 해야 하나요?</h3>
          <button className='absolute right-16' onClick={closeModal}>
            <BrokenXIcon size={24} color={colors.black.default} />
          </button>
        </header>
      </div>
    </section>
  )
}
