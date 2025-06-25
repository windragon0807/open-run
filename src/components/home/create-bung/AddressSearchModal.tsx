import { Dimmed } from '@/components/shared/Modal'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import BrokenXIcon from '@icons/BrokenXIcon'
import useDebounce from '@hooks/useDebounce'
import useGeolocation from '@hooks/useGeolocation'
import { ResponseType } from '@apis/maps/places'
import { usePlacesAutocomplete } from '@apis/maps/places/mutation'
import { useReverseGeocodingMutation } from '@apis/maps/reverse-geocoding/mutation'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'

type Suggestion = {
  placeId: string
  mainAddress: string
  secondaryAddress: string
}

export default function AddressSearchModal({ onComplete }: { onComplete: (address: string) => void }) {
  const { closeModal } = useModal()
  const { location } = useGeolocation()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedSuggestionPlaceId, setSelectedSuggestionPlaceId] = useState<string | null>(null)

  const { mutate: fetchPlacesAutocomplete } = usePlacesAutocomplete()
  const { mutate: fetchReverseGeocoding, isLoading: isReverseGeocodingLoading } = useReverseGeocodingMutation()

  const renderHighlightKeyword = (text: string, keyword: string) => {
    if (keyword === '') return text

    const parts = text.split(keyword)
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && <span className='font-bold'>{keyword}</span>}
      </span>
    ))
  }

  const handleCurrentLocationClick = () => {
    if (location == null) return

    fetchReverseGeocoding(
      { lat: location.lat, lng: location.lng },
      {
        onSuccess: (data) => {
          onComplete(data)
          closeModal(MODAL_KEY.ADDRESS_SEARCH)
        },
      },
    )
  }

  useEffect(() => {
    if (debouncedSearch === '') {
      setSuggestions([])
      return
    }

    fetchPlacesAutocomplete(
      { input: debouncedSearch },
      {
        onSuccess: ({ suggestions }: ResponseType) => {
          setSuggestions(
            suggestions.map(({ placePrediction: { placeId, structuredFormat } }) => ({
              placeId,
              mainAddress: structuredFormat.mainText.text,
              secondaryAddress: structuredFormat.secondaryText.text,
            })),
          )
        },
      },
    )
  }, [debouncedSearch])

  return (
    <Dimmed onClick={() => closeModal(MODAL_KEY.ADDRESS_SEARCH)}>
      <article
        className='absolute left-1/2 top-1/2 aspect-[328/480] max-h-[650px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-10 bg-white'
        onClick={(e) => e.stopPropagation()}>
        <div className='h-full w-full'>
          <header className='relative mb-16 flex h-60 w-full items-center'>
            <h2 className='w-full text-center font-bold'>주소검색</h2>
            <button className='absolute right-12' onClick={() => closeModal(MODAL_KEY.ADDRESS_SEARCH)}>
              <BrokenXIcon size={24} color={colors.black.DEFAULT} />
            </button>
          </header>

          <div className='h-[calc(100%-76px)] px-24'>
            <div className='mb-8 flex items-center gap-16'>
              <input
                className='flex-1 rounded-8 border border-gray p-12 text-16 focus:border-primary focus:outline-none'
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='도로명, 건물명, 지번 입력'
                disabled={isReverseGeocodingLoading}
              />
              {search.length > 0 && (
                <button
                  className='text-14'
                  onClick={() => {
                    setSearch('')
                    setSuggestions([])
                  }}>
                  취소
                </button>
              )}
            </div>
            <div className='h-[calc(100%-74px)] overflow-y-auto scrollbar-hide'>
              {suggestions.length === 0 ? (
                <div className='flex flex-col'>
                  <button
                    className='mb-24 flex h-32 w-full items-center justify-center gap-4 rounded-8 bg-gray-lighten disabled:text-gray-darker'
                    disabled={location == null || isReverseGeocodingLoading}
                    onClick={handleCurrentLocationClick}>
                    <span className='text-14'>현재 위치</span>
                    <svg width={16} height={16} viewBox='0 0 16 16'>
                      <path
                        className='fill-black-darken'
                        d='M8.00037 1.33301C11.567 1.33318 14.4789 4.13399 14.6576 7.65625L14.6664 7.99902C14.6664 11.5658 11.8656 14.4787 8.34314 14.6572L8.00037 14.666C7.77524 14.666 7.55276 14.6546 7.33337 14.6328V11.333H8.66638V13.29C11.0787 12.9892 12.9894 11.0784 13.2904 8.66602H11.3334V7.33301H13.2904C12.9895 4.92046 11.079 3.00876 8.66638 2.70801V4.66602H7.33337V2.70801C4.92103 3.00903 3.01026 4.92067 2.70935 7.33301H4.66638V8.66602H1.36658C1.34479 8.44668 1.33337 8.22409 1.33337 7.99902L1.34216 7.65625C1.51505 4.24764 4.24803 1.51478 7.65662 1.3418L8.00037 1.33301Z'
                      />
                    </svg>
                  </button>
                  <span className='mb-8 text-14 font-bold'>검색 팁</span>
                  <span className='text-14 text-gray-darker'>도로명 + 건물번호</span>
                  <span className='mb-8 text-14 text-pink'>여의서로 330</span>
                  <span className='text-14 text-gray-darker'>지번 주소</span>
                  <span className='mb-8 text-14 text-pink'>잠실동 47</span>
                  <span className='text-14 text-gray-darker'>장소명</span>
                  <span className='mb-24 text-14 text-pink'>뚝섬한강공원, 서울숲</span>
                  <span className='text-14 font-bold'>
                    러닝을 시작할 정확한 위치는 &apos;상세주소&apos;란에 적어주세요
                  </span>
                  <span className='text-14'>
                    <span className='text-gray-darker'>종로3가역</span>{' '}
                    <span className='text-pink'>&apos;2-1번 출구 인근 물품보관함&apos;</span>
                  </span>
                </div>
              ) : (
                <ul className='flex flex-col divide-y divide-gray pb-24 pt-16'>
                  {suggestions.map(({ placeId, mainAddress, secondaryAddress }) => (
                    <li
                      key={placeId}
                      className='flex cursor-pointer flex-col p-8'
                      onClick={() => {
                        if (selectedSuggestionPlaceId === placeId) {
                          setSelectedSuggestionPlaceId(null)
                        } else {
                          setSelectedSuggestionPlaceId(placeId)
                        }
                      }}>
                      <div className='flex items-center justify-between gap-8'>
                        <div className='flex flex-col'>
                          <span className='text-14'>{renderHighlightKeyword(mainAddress, search)}</span>
                          <span className='text-14 text-gray-darker'>{secondaryAddress}</span>
                        </div>
                        {selectedSuggestionPlaceId === placeId && (
                          <button
                            className='flex-shrink-0 rounded-20 bg-black-darken px-18 py-4 text-14 text-white'
                            onClick={() => {
                              onComplete(`${secondaryAddress} ${mainAddress}`)
                              closeModal(MODAL_KEY.ADDRESS_SEARCH)
                            }}>
                            선택
                          </button>
                        )}
                      </div>
                      {selectedSuggestionPlaceId === placeId && (
                        <div className='relative mt-8 aspect-[264/210] w-full'>
                          {/* https://developers.google.com/maps/documentation/maps-static/start?hl=ko */}
                          <Image
                            className='rounded-10 border border-gray'
                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${mainAddress}&zoom=16&size=400x400&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                            alt='Google Static Map'
                            fill
                            unoptimized
                            placeholder='blur'
                            blurDataURL='/images/maps/map_placeholder.png'
                          />
                          <Image
                            className='absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2'
                            src='/images/maps/marker_destination.png'
                            alt='Destination Marker'
                            width={20}
                            height={35}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </article>
    </Dimmed>
  )
}
