import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useModal } from '@contexts/ModalProvider'
import { MODAL_KEY } from '@constants/modal'
import RarityBadge from '../avatar/shared/RarityBadge'
import PrimaryButton from '../shared/PrimaryButton'

export default function RewardModal() {
  const router = useRouter()
  const { closeModal } = useModal()

  const text = '신규 획득!'

  return (
    <article className='z-modal fixed bottom-0 left-0 right-0 top-0 bg-gradient-primary-white'>
      <div className='flex h-full w-full flex-col items-center justify-center'>
        <h4 className='text-28 font-bold text-white'>
          {text.split('').map((char, index) => (
            <motion.span
              key={index}
              className='inline-block'
              initial={{ y: 0 }}
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 2,
              }}>
              {char}
            </motion.span>
          ))}
        </h4>
        <div className='relative mb-8 aspect-square w-168'>
          <span className='absolute bottom-0 left-1/2 -translate-x-1/2 font-jost text-56 font-[900] italic text-white opacity-10'>
            00001
          </span>
          <Image
            src='/temp/avatar/upperClothing/nft_upperClothing_2.png'
            alt='Avatar'
            fill
            className='object-contain'
          />
        </div>

        <RarityBadge rarity='epic' className='mb-8' />
        <h4 className='mb-4 text-16 font-bold text-white'>상의</h4>

        <div className='absolute bottom-40 flex w-[calc(100%-32px)] flex-col gap-10'>
          <button
            className='h-56 w-full rounded-8 bg-white text-16 font-bold text-black'
            onClick={() => closeModal(MODAL_KEY.REWARD)}>
            확인
          </button>
          <PrimaryButton
            onClick={() => {
              router.push('/avatar')
              closeModal(MODAL_KEY.REWARD)
            }}>
            아바타 꾸미러 가기
          </PrimaryButton>
        </div>
      </div>
    </article>
  )
}
