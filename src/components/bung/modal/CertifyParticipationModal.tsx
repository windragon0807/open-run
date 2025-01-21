import { useQuery } from 'react-query'
import { Container, NaverMap, Marker, useNavermaps } from 'react-naver-maps'
import { useGeocode } from '@apis/maps/fetchGeocode/query'
import { fetchDistance } from '@apis/maps/fetchDistance/api'
import { useModalContext } from '@contexts/ModalContext'
import useGeolocation from '@hooks/useGeolocation'
import CloseIcon from '@icons/CloseIcon'
import PrimaryButton from '@shared/PrimaryButton'
import LoadingLogo from '@shared/LoadingLogo'
import '../map.css'

const 참여인증거리 = 500 // 500m

export default function CertifyParticipationModal({ destination }: { destination: string }) {
  const { closeModal } = useModalContext()
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

  return (
    <section
      className='fixed bottom-0 left-0 w-full bg-gray-lighten rounded-t-2xl px-16'
      onClick={(e) => e.stopPropagation()}>
      <header className='w-full h-60 flex items-center justify-center'>
        <button className='absolute left-16' onClick={closeModal}>
          <CloseIcon />
        </button>
        <span className='text-black-darken text-base font-bold'>참여 인증</span>
      </header>
      <section className='w-full h-200'>
        {모든좌표가유효한가 === true ? (
          <Map curLat={latitude} curLng={longitude} desLat={Number(coordinates.lat)} desLng={Number(coordinates.lng)} />
        ) : (
          <Container className='maps' style={{ height: 200 }}>
            <div className='flex items-center justify-center w-full h-full border border-gray'>
              <span className='text-sm text-gray'>지도를 표시할 수 없습니다.</span>
            </div>
          </Container>
        )}
      </section>
      <PrimaryButton className='mt-20 mb-40' disabled={distance == null || distance > 참여인증거리}>
        {distance == null && <LoadingLogo />}
        {distance != null && distance <= 참여인증거리 && '참여 인증 완료'}
        {distance != null && distance > 참여인증거리 && '목적지까지 500m 이내여야 합니다.'}
      </PrimaryButton>
    </section>
  )
}

function Map({ curLat, curLng, desLat, desLng }: { curLat: number; curLng: number; desLat: number; desLng: number }) {
  const navermaps = useNavermaps()
  const currentPosition = new navermaps.LatLng(curLat, curLng)
  const destinationPosition = new navermaps.LatLng(desLat, desLng)

  return (
    <Container className='maps' style={{ height: 200 }}>
      <NaverMap defaultCenter={currentPosition} defaultZoom={15}>
        <Marker
          defaultPosition={currentPosition}
          icon={{
            url: '/images/maps/marker_current.png',
            size: new navermaps.Size(16, 16),
            scaledSize: new navermaps.Size(16, 16),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(8, 25),
          }}
        />
        <Marker
          defaultPosition={destinationPosition}
          icon={{
            url: '/images/maps/marker_destination.png',
            size: new navermaps.Size(16, 27),
            scaledSize: new navermaps.Size(16, 27),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(8, 36),
          }}
        />
      </NaverMap>
    </Container>
  )
}
