import { ChangeEvent, useCallback, useState } from 'react'
import { useMutation } from 'react-query'
import Image from 'next/image'

import Input from '@shared/Input'
import NumberInput from '@shared/NumberInput'
import TextArea from '@shared/TextArea'
import DatePicker from '@shared/DatePicker'
import TimePicker from '@shared/TimePicker'
import PrimaryButton from '@shared/PrimaryButton'
import HashTag from '@shared/HashTag'
import LoadingLogo from '@shared/LoadingLogo'
import ClockIcon from '@icons/ClockIcon'
import CalendarIcon from '@icons/CalendarIcon'
import { createBung as _createBung } from '@apis/bungs/createBung/api'
import AddressSearchModal from './AddressSearchModal'
import FormTitle from '@components/bung/components/FormTitle'
import HashTagSearch from '@components/bung/components/HashTagSearch'
import Button from '@components/bung/components/Button'
import { colors } from '@styles/colors'
import { currentDate, formatDate } from '@utils/time'
import { useRefetchQuery } from '@hooks/useRefetchQuery'
import { queryKey } from '@apis/bungs/fetchMyBungs/query'
import { getRandomNumber } from '@utils/number'
import RandomIcon from '@icons/RandomIcon'

type FormValues = {
  bungName: string
  description: string
  location: string
  detailedAddress: string
  startDate?: Date
  startTime?: string // 'hh:mm'
  runningTime: string
  distance: string
  paceMinute: string
  paceSecond: string
  memberNumber: string
  hasAfterRun?: boolean
  afterRunDescription: string
  hashTags: string[]
}

const imageList = [
  '/images/bung/img_thumbnail_1.png',
  '/images/bung/img_thumbnail_2.png',
  '/images/bung/img_thumbnail_3.png',
  '/images/bung/img_thumbnail_4.png',
]

export default function Forms({ nextStep }: { nextStep: () => void }) {
  const 메인페이지벙리스트업데이트 = useRefetchQuery(queryKey)

  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(imageList[0])
  const [formValues, setFormValues] = useState<FormValues>({
    bungName: '',
    description: '',
    location: '',
    detailedAddress: '',
    runningTime: '',
    distance: '',
    paceMinute: '',
    paceSecond: '',
    memberNumber: '',
    afterRunDescription: '',
    hashTags: [],
  })

  const handleFormValues = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const { mutate: createBung, isLoading } = useMutation(_createBung)
  const handleSubmit = () => {
    const {
      bungName,
      description,
      location,
      startDate,
      startTime,
      runningTime,
      distance,
      paceMinute,
      paceSecond,
      memberNumber,
      hasAfterRun,
      afterRunDescription,
    } = formValues

    if (bungName === '') {
      alert('벙 이름을 입력해주세요')
      return
    }

    if (location === '') {
      alert('장소를 검색해주세요')
      return
    }

    if (startDate == null) {
      alert('시작 날짜를 선택해주세요')
      return
    }

    if (startTime == null) {
      alert('시작 시간을 선택해주세요')
      return
    }

    if (runningTime == null || Number(runningTime) <= 0) {
      alert('예상 시간을 확인해주세요')
      return
    }

    if (distance == null || Number(distance) <= 0) {
      alert('목표 거리를 확인해주세요')
      return
    }

    if (paceMinute == null || Number(paceMinute) < 0) {
      alert('페이스를 확인해주세요')
      return
    }

    if (paceSecond == null || Number(paceSecond) < 0) {
      alert('페이스를 확인해주세요')
      return
    }

    if (memberNumber == null || Number(memberNumber) < 1) {
      alert('참가 인원을 확인해주세요')
      return
    }

    if (hasAfterRun == null) {
      alert('뒷풀이 여부를 선택해주세요')
      return
    }

    const [hour, minute] = startTime.split(':').map(Number)
    startDate.setHours(hour)
    startDate.setMinutes(minute)

    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + Number(runningTime))

    const now = currentDate()
    if (startDate < now) {
      alert('시작 시간은 현재 시점 이후여야 합니다.')
      return
    }

    const result = {
      name: bungName,
      description,
      location: `${location} ${formValues.detailedAddress}`,
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
      distance: Number(distance),
      pace: `${formValues.paceMinute}'${formValues.paceSecond}"`,
      memberNumber: Number(memberNumber),
      hasAfterRun,
      afterRunDescription: hasAfterRun ? afterRunDescription : '',
      hashtags: formValues.hashTags,
    }

    createBung(result, {
      onSuccess: () => {
        메인페이지벙리스트업데이트()
        nextStep()
      },
    })
  }

  const [isAddressSearchModalOpen, setAddressSearchModalOpen] = useState(false)
  const [isDatePickerOpen, setDatePickerOpen] = useState(false)
  const [isTimePickerOpen, setTimePickerOpen] = useState(false)

  const 시작날짜를선택했는가 = formValues.startDate != null
  const 시작시간을선택했는가 = formValues.startTime != null

  return (
    <section className='w-full flex flex-col overflow-y-auto px-16'>
      {isAddressSearchModalOpen ? (
        <AddressSearchModal
          onClose={() => setAddressSearchModalOpen(false)}
          onComplete={(address) => {
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              location: address.address,
            }))
          }}
        />
      ) : null}

      <section className='relative w-full mx-auto h-184 mb-32'>
        <Image className='rounded-8' src={selectedImageUrl} alt='Random Thumbnail Image' fill />
        <button
          className='absolute bottom-16 right-16 p-8 rounded-4 bg-primary'
          onClick={() => setSelectedImageUrl(imageList[getRandomNumber(0, imageList.length - 1)])}>
          <RandomIcon size={24} color={colors.white} />
        </button>
      </section>

      {/** 벙 이름 */}
      <div className='flex flex-col gap-8 mb-16'>
        <FormTitle required>벙 이름</FormTitle>
        <Input
          name='bungName'
          type='text'
          placeholder='벙 이름을 입력하세요'
          value={formValues.bungName}
          onChange={handleFormValues}
        />
      </div>

      {/** 설명 */}
      <div className='flex flex-col gap-8 mb-16'>
        <FormTitle>설명</FormTitle>
        <TextArea
          className='h-80 pt-10'
          name='description'
          placeholder='벙 설명을 입력하세요'
          value={formValues.description}
          onChange={handleFormValues}
        />
      </div>

      {/** 장소 (주소검색 + 상세정보) */}
      <div className='flex flex-col gap-8 mb-16'>
        <FormTitle required>장소</FormTitle>
        <div className='w-full flex gap-8'>
          <div className='flex-1'>
            <Input
              className='disabled:bg-gray-default'
              name='location'
              type='text'
              placeholder='주소 검색'
              value={formValues.location}
              disabled
            />
          </div>
          <button
            className='w-80 h-40 bg-primary rounded-8 text-white font-semibold place-items-center text-sm'
            onClick={() => setAddressSearchModalOpen(true)}>
            주소 검색
          </button>
        </div>
        <Input
          name='detailedAddress'
          type='text'
          placeholder='정확한 위치를 입력하세요'
          value={formValues.detailedAddress}
          onChange={handleFormValues}
        />
      </div>

      {/** 시작 일시 (날짜 선택 + 시간 선택) */}
      <div className='relative flex flex-col gap-8 mb-16'>
        <FormTitle required>시작 일시</FormTitle>
        <div className='w-full flex gap-8'>
          <Button
            className={`${시작날짜를선택했는가 ? 'border-primary bg-primary/10' : 'bg-white'} pl-16`}
            onClick={() => {
              setDatePickerOpen((prev) => !prev)
              if (isTimePickerOpen) setTimePickerOpen(false)
            }}>
            <CalendarIcon size={16} color={시작날짜를선택했는가 ? colors.primary : colors.black.default} />
            <p className={시작날짜를선택했는가 ? 'text-primary' : 'text-black-default'}>
              {시작날짜를선택했는가 ? formatDate(formValues.startDate as Date, 'yyyy년 M월 d일') : '날짜 선택'}
            </p>
          </Button>
          <Button
            className={`${시작시간을선택했는가 ? 'border-primary bg-primary/10' : 'bg-white'} pl-16`}
            onClick={() => {
              setTimePickerOpen((prev) => !prev)
              if (isDatePickerOpen) setDatePickerOpen(false)
            }}>
            <ClockIcon size={16} color={시작시간을선택했는가 ? colors.primary : colors.black.default} />
            <p className={시작시간을선택했는가 ? 'text-primary' : 'text-black-default'}>
              {시작시간을선택했는가 ? (formValues.startTime as string).replace(':', ' : ') : '시간 선택'}
            </p>
          </Button>
        </div>

        {isDatePickerOpen ? (
          <div className='w-full flex justify-center bg-white p-16 rounded-8 border border-gray-default'>
            <DatePicker
              defaultValue={formValues.startDate}
              onDateClick={(date) => {
                setFormValues((prevFormValues) => ({
                  ...prevFormValues,
                  startDate: date,
                }))
              }}
              startMonth={currentDate()}
              disabled={(date) => {
                // 오늘 이전 날짜는 비활성화
                const today = currentDate()
                today.setHours(0, 0, 0, 0)
                date.setHours(0, 0, 0, 0)
                return date < today
              }}
            />
          </div>
        ) : null}
        {isTimePickerOpen ? (
          <div className='bg-white p-16 rounded-8 border border-gray-default'>
            <TimePicker
              value={formValues.startTime}
              onChange={(time) => {
                setFormValues((prevFormValues) => ({
                  ...prevFormValues,
                  startTime: time,
                }))
              }}
            />
          </div>
        ) : null}
      </div>

      {/** 예상 시간 (분) */}
      <div className='relative flex flex-col gap-8 mb-16'>
        <FormTitle required>예상 시간</FormTitle>
        <NumberInput
          className='pr-40'
          name='runningTime'
          placeholder='예상되는 소요 시간을 알려주세요'
          value={formValues.runningTime}
          onChange={handleFormValues}
          addon={<span className='absolute right-16 bottom-10 text-sm text-black-default'>분</span>}
        />
      </div>

      {/** 거리 (km) */}
      <div className='relative flex flex-col gap-8 mb-16'>
        <FormTitle required>거리</FormTitle>
        <NumberInput
          className='pr-40'
          name='distance'
          placeholder='목표 거리를 입력하세요'
          value={formValues.distance}
          onChange={handleFormValues}
          addon={<span className='absolute right-16 bottom-10 text-sm text-black-default'>km</span>}
        />
      </div>

      {/** 페이스 (n'mm") */}
      <div className='flex flex-col gap-8 mb-16'>
        <FormTitle required>페이스</FormTitle>
        <div className='flex gap-8'>
          <NumberInput
            name='paceMinute'
            placeholder='분'
            value={formValues.paceMinute}
            onChange={handleFormValues}
            addon={
              <span className='absolute right-16 bottom-10 text-sm text-black-default font-bold italic'>{"'"}</span>
            }
          />
          <NumberInput
            name='paceSecond'
            placeholder='초'
            value={formValues.paceSecond}
            onChange={handleFormValues}
            addon={
              <span className='absolute right-16 bottom-10 text-sm text-black-default font-bold italic'>{'"'}</span>
            }
          />
        </div>
      </div>

      {/** 참가 인원 */}
      <div className='relative flex flex-col gap-8 mb-16'>
        <FormTitle required>참가 인원</FormTitle>
        <NumberInput
          name='memberNumber'
          placeholder='3명 이상 입력하세요'
          value={formValues.memberNumber}
          onChange={handleFormValues}
        />
      </div>

      {/** 뒷풀이 */}
      <div className='relative flex flex-col gap-8 mb-16'>
        <FormTitle required>뒷풀이</FormTitle>
        <div className='flex gap-8'>
          <Button
            className={`justify-center ${formValues.hasAfterRun === true ? 'bg-primary/10 border-primary' : 'bg-white border-gray-default'}`}
            onClick={() => {
              setFormValues((prev) => ({
                ...prev,
                hasAfterRun: true,
              }))
            }}>
            유
          </Button>
          <Button
            className={`justify-center ${formValues.hasAfterRun === false ? 'bg-primary/10 border-primary' : 'bg-white border-gray-default'}`}
            onClick={() => {
              setFormValues((prev) => ({
                ...prev,
                hasAfterRun: false,
              }))
            }}>
            무
          </Button>
        </div>
        {formValues.hasAfterRun ? (
          <TextArea
            name='afterRunDescription'
            placeholder='뒷풀이에 대한 내용을 입력하세요'
            className='h-80 pt-10'
            value={formValues.afterRunDescription}
            onChange={handleFormValues}
          />
        ) : null}
      </div>

      {/** 해시태그 */}
      <div className='relative flex flex-col gap-8 mb-80'>
        <FormTitle>해시태그</FormTitle>
        <div className='flex flex-wrap gap-8'>
          {formValues.hashTags.map((label) => (
            <HashTag
              key={`HashTag-${label}`}
              label={label}
              onCloseButtonClick={() => {
                setFormValues((prev) => ({
                  ...prev,
                  hashTags: prev.hashTags.filter((tag) => tag !== label),
                }))
              }}
            />
          ))}
        </div>
        <HashTagSearch
          onTagClick={(newTag) => {
            setFormValues((prev) => ({
              ...prev,
              hashTags: [...prev.hashTags, newTag],
            }))
          }}
        />
      </div>

      {/** 벙 만들기 버튼 */}
      <PrimaryButton className='mb-40' onClick={handleSubmit}>
        {isLoading ? <LoadingLogo color={colors.secondary} className='mx-auto' /> : '벙 만들기'}
      </PrimaryButton>
    </section>
  )
}
