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
    <section className={`fixed bottom-0 left-0 right-0 top-0 z-[1000] bg-black-darkest/60`}>
      <section className='absolute left-[50%] top-[10%] w-[90%] -translate-x-1/2 rounded-10 bg-white'>
        <div className='h-full w-full'>
          <header className='relative flex h-60 w-full items-center'>
            <h2 className='w-full text-center font-bold'>주소검색</h2>
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
