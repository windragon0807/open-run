import DaumPostcodeEmbed, { Address } from 'react-daum-postcode'

import Spacing from '@shared/Spacing'
import CloseIcon from '@components/icons/CloseIcon'

export default function AddressSearchModal({
  onClose,
  onComplete,
}: {
  onClose: () => void
  onComplete: (address: Address) => void
}) {
  return (
    <section className='fixed top-0 right-0 left-0 bottom-0 bg-[#000] bg-opacity-60 z-[1000]'>
      <section className='absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] bg-white rounded-10'>
        <div className='w-full h-full'>
          <header className='relative w-full h-40 flex items-center'>
            <h2 className='w-full font-bold text-center'>주소검색</h2>
            <button className='absolute right-12' onClick={onClose}>
              <CloseIcon />
            </button>
          </header>
          <Spacing size={8} />
          <div className='h-[calc(100%-80px)]'>
            <DaumPostcodeEmbed
              className='w-[80%]'
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
