import DaumPostcodeEmbed, { Address } from 'react-daum-postcode'

import Spacing from '@shared/Spacing'
import BrokenXIcon from '@icons/BrokenXIcon'
import { colors } from '@styles/colors'

export default function AddressSearchModal({
  onClose,
  onComplete,
}: {
  onClose: () => void
  onComplete: (address: Address) => void
}) {
  return (
    <section className={`fixed top-0 right-0 left-0 bottom-0 bg-black-darkest/60 z-[1000]`}>
      <section className='absolute top-[10%] left-[50%] -translate-x-1/2 w-[90%] bg-white rounded-10'>
        <div className='w-full h-full'>
          <header className='relative w-full h-60 flex items-center'>
            <h2 className='w-full font-bold text-center'>주소검색</h2>
            <button className='absolute right-12' onClick={onClose}>
              <BrokenXIcon size={24} color={colors.black.default} />
            </button>
          </header>
          <div className='h-[calc(100%-80px)]'>
            <DaumPostcodeEmbed
              className='w-full'
              onComplete={(address) => {
                onComplete(address)
                onClose()
              }}
            />
          </div>
          <Spacing size={8} />
        </div>
      </section>
    </section>
  )
}
