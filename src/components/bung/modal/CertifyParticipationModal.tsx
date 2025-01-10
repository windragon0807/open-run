import CloseIcon from '@icons/CloseIcon'
import { useModalContext } from '@contexts/ModalContext'
import useGeolocation from '@hooks/useGeolocation'
import NaverMap from '../NaverMap'

export default function CertifyParticipationModal({ destination }: { destination: string }) {
  const { closeModal } = useModalContext()
  const { latitude, longitude } = useGeolocation()
  console.log(latitude, longitude)
  return (
    <section
      className='fixed bottom-0 left-0 w-full h-300 bg-gray-lighten rounded-t-2xl'
      onClick={(e) => e.stopPropagation()}>
      <header className='w-full h-60 flex items-center justify-center'>
        <button className='absolute left-16' onClick={closeModal}>
          <CloseIcon />
        </button>
        <span className='text-black-darken text-base font-bold'>참여 인증</span>
      </header>
      <section>
        {latitude != null && longitude != null && (
          <NaverMap location={destination} curCoordinates={[String(latitude), String(longitude)]} />
        )}
      </section>
    </section>
  )
}
