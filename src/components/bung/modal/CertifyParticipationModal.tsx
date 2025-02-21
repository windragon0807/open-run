import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useQuery } from 'react-query'
import { Container, NaverMap, Marker, useNavermaps } from 'react-naver-maps'
import { useGeocode } from '@apis/maps/fetchGeocode/query'
import { fetchDistance } from '@apis/maps/fetchDistance/api'
import { useModalContext } from '@contexts/ModalContext'
import useGeolocation from '@hooks/useGeolocation'
import BrokenXIcon from '@icons/BrokenXIcon'
import PrimaryButton from '@shared/PrimaryButton'
import LoadingLogo from '@shared/LoadingLogo'
import { BottomSheet } from '@shared/Modal'
import { colors } from '@styles/colors'
import { useCertifyParticipation } from '@apis/bungs/certifyParticipation/mutation'
import '../map.css'

const 참여인증거리 = 1_500 // 500m ?

export default function CertifyParticipationModal({ destination, bungId }: { destination: string; bungId: string }) {
  const router = useRouter()
  const { closeModal } = useModalContext()
  const { mutate: certifyParticipation } = useCertifyParticipation()
  const { latitude, longitude } = useGeolocation()
  const { data: coordinates } = useGeocode(destination)
  const 모든좌표가유효한가 = latitude != null && longitude != null && coordinates != null

  const { data: distance } = useQuery({
    queryKey: ['distance', latitude, longitude, coordinates?.lat, coordinates?.lng],
    queryFn: () =>
      fetchDistance({
        startLat: String(latitude),
        startLng: String(longitude),
        endLat: String(coordinates?.lat),
        endLng: String(coordinates?.lng),
      }),
    enabled: 모든좌표가유효한가 === true,
  })
  console.log('ryong', distance)

  const handleClick = () => {
    certifyParticipation(
      { bungId },
      {
        onSuccess: () => {
          router.refresh()
          closeModal()
        },
      },
    )
  }

  return (
    <BottomSheet className='px-16'>
      <header className='w-full h-60 flex items-center justify-center'>
        <button className='absolute left-16' onClick={closeModal}>
          <BrokenXIcon size={24} color={colors.black.default} />
        </button>
        <span className='text-black-darken text-base font-bold'>참여 인증</span>
      </header>
      <section className='w-full'>
        {모든좌표가유효한가 === true ? (
          <Map curLat={latitude} curLng={longitude} desLat={Number(coordinates.lat)} desLng={Number(coordinates.lng)} />
        ) : (
          <div className='relative w-full aspect-square animate-pulse'>
            <Image className='object-cover' src='/images/maps/map_placeholder.png' alt='map' fill />
          </div>
        )}
      </section>
      <PrimaryButton
        className='mt-20 mb-40'
        disabled={distance == null || distance > 참여인증거리}
        onClick={handleClick}>
        {distance == null && <LoadingLogo />}
        {distance != null && distance <= 참여인증거리 && '참여 인증 완료'}
        {distance != null && distance > 참여인증거리 && '목적지까지 500m 이내여야 합니다.'}
      </PrimaryButton>
    </BottomSheet>
  )
}

function Map({ curLat, curLng, desLat, desLng }: { curLat: number; curLng: number; desLat: number; desLng: number }) {
  const navermaps = useNavermaps()
  const currentPosition = new navermaps.LatLng(curLat, curLng)
  const destinationPosition = new navermaps.LatLng(desLat, desLng)

  return (
    <Container className='maps' style={{ aspectRatio: 1 }}>
      <NaverMap defaultCenter={currentPosition} defaultZoom={15}>
        <Marker
          defaultPosition={currentPosition}
          icon={{
            url: '/images/maps/marker_current.png',
            size: new navermaps.Size(22, 22),
            scaledSize: new navermaps.Size(22, 22),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(8, 25),
          }}
        />
        <Marker
          defaultPosition={destinationPosition}
          icon={{
            url: '/images/maps/marker_destination.png',
            size: new navermaps.Size(22, 34),
            scaledSize: new navermaps.Size(22, 34),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(11, 42),
          }}
        />
      </NaverMap>
    </Container>
  )
}
