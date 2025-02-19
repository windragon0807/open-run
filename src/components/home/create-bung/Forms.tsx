import { useRef, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
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
import { useCreateBung } from '@apis/bungs/createBung/mutation'

type FormValues = {
  imageUrl: string
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
  hasAfterRun: boolean
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
  const [isAddressSearchModalOpen, setAddressSearchModalOpen] = useState(false)
  const [isDatePickerOpen, setDatePickerOpen] = useState(false)
  const [isTimePickerOpen, setTimePickerOpen] = useState(false)
  const dateElementRef = useRef<HTMLDivElement>(null)

  const { mutate: createBung, isLoading } = useCreateBung()
  const 메인페이지벙리스트업데이트 = useRefetchQuery(queryKey)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      imageUrl: imageList[0],
      bungName: '',
      description: '',
      location: '',
      detailedAddress: '',
      runningTime: '',
      distance: '',
      paceMinute: '',
      paceSecond: '',
      memberNumber: '',
      hasAfterRun: false,
      afterRunDescription: '',
      hashTags: [],
    },
  })

  const onSubmit = (formData: FormValues) => {
    if (formData.startDate == null) {
      setError('startDate', { message: '필수 항목입니다' })
      dateElementRef.current?.scrollIntoView({ block: 'center' })
    }

    if (formData.startTime == null) {
      setError('startTime', { message: '필수 항목입니다' })
      dateElementRef.current?.scrollIntoView({ block: 'center' })
      return
    }

    const startDate = formData.startDate as Date
    const [hour, minute] = (formData.startTime as string).split(':').map(Number)
    startDate.setHours(hour)
    startDate.setMinutes(minute)

    if (startDate < currentDate()) {
      setError('startTime', { message: '시작 시간은 현재 시점 이후여야 합니다.' })
      dateElementRef.current?.scrollIntoView({ block: 'center' })
      return
    }

    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + Number(formData.runningTime))

    const requestBody = {
      name: formData.bungName,
      description: formData.description,
      location: `${formData.location} ${formData.detailedAddress}`,
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
      distance: Number(formData.distance),
      pace: `${formData.paceMinute}'${formData.paceSecond}"`,
      memberNumber: Number(formData.memberNumber),
      hasAfterRun: formData.hasAfterRun,
      afterRunDescription: formData.hasAfterRun ? formData.afterRunDescription : '',
      hashtags: formData.hashTags,
      mainImage: formData.imageUrl,
    }

    createBung(requestBody, {
      onSuccess: () => {
        메인페이지벙리스트업데이트()
        nextStep()
      },
    })
  }

  const 시작날짜를선택했는가 = watch('startDate') != null
  const 시작시간을선택했는가 = watch('startTime') != null

  return (
    <section className='w-full flex flex-col overflow-y-auto px-16'>
      {isAddressSearchModalOpen ? (
        <AddressSearchModal
          onClose={() => setAddressSearchModalOpen(false)}
          onComplete={(address) => {
            setValue('location', address.address)
          }}
        />
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/** 랜덤 이미지 선택 */}
        <section className='relative w-full mx-auto h-184 mb-32'>
          <Image className='rounded-8' src={watch('imageUrl')} alt='Random Thumbnail Image' fill />
          <button
            className='absolute bottom-16 right-16 p-8 rounded-4 bg-primary'
            onClick={() => setValue('imageUrl', imageList[getRandomNumber(0, imageList.length - 1)])}>
            <RandomIcon size={24} color={colors.white} />
          </button>
        </section>

        {/** 벙 이름 */}
        <div className='flex flex-col gap-8 mb-16'>
          <FormTitle required>벙 이름</FormTitle>
          <Input
            placeholder='벙 이름을 입력하세요'
            error={errors.bungName?.message}
            {...register('bungName', {
              required: '필수 항목입니다',
            })}
          />
        </div>

        {/** 설명 */}
        <div className='flex flex-col gap-8 mb-16'>
          <FormTitle>설명</FormTitle>
          <TextArea className='h-80 pt-10' placeholder='간단한 소개를 입력하세요' {...register('description')} />
        </div>

        {/** 장소 (주소검색 + 상세정보) */}
        <div className='flex flex-col gap-8 mb-16'>
          <FormTitle required>장소</FormTitle>
          <div className='w-full flex gap-8'>
            <div className='flex-1'>
              <Input className='disabled:bg-gray-default' placeholder='주소 검색' value={watch('location')} disabled />
            </div>
            <button
              type='button'
              className='w-80 h-40 bg-primary rounded-8 text-white font-semibold place-items-center text-sm'
              onClick={() => setAddressSearchModalOpen(true)}>
              주소 검색
            </button>
          </div>
          <Input placeholder='정확한 위치를 입력하세요' {...register('detailedAddress')} />
        </div>

        {/** 시작일시 (날짜선택 + 시간선택) */}
        <div ref={dateElementRef} className='relative flex flex-col gap-8 mb-16'>
          <FormTitle required>시작 일시</FormTitle>
          <div className='w-full flex gap-8'>
            <Button
              className={clsx('pl-16', 시작날짜를선택했는가 ? 'border-primary bg-primary/10' : 'bg-white')}
              onClick={() => {
                setDatePickerOpen((prev) => !prev)
                if (isTimePickerOpen) setTimePickerOpen(false)
              }}>
              <CalendarIcon size={16} color={시작날짜를선택했는가 ? colors.primary : colors.black.default} />
              <p className={시작날짜를선택했는가 ? 'text-primary' : 'text-black-default'}>
                {시작날짜를선택했는가 ? formatDate(watch('startDate') as Date, 'yyyy년 M월 d일') : '날짜 선택'}
              </p>
            </Button>
            <Button
              className={clsx('pl-16', 시작시간을선택했는가 ? 'border-primary bg-primary/10' : 'bg-white')}
              onClick={() => {
                setTimePickerOpen((prev) => !prev)
                if (isDatePickerOpen) setDatePickerOpen(false)
              }}>
              <ClockIcon size={16} color={시작시간을선택했는가 ? colors.primary : colors.black.default} />
              <p className={시작시간을선택했는가 ? 'text-primary' : 'text-black-default'}>
                {시작시간을선택했는가 ? (watch('startTime') as string).replace(':', ' : ') : '시간 선택'}
              </p>
            </Button>
          </div>

          {isDatePickerOpen ? (
            <div className='w-full flex justify-center bg-white p-16 rounded-8 border border-gray-default'>
              <DatePicker
                defaultValue={watch('startDate')}
                onDateClick={(date) => {
                  setValue('startDate', date)
                  clearErrors('startDate')
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
                value={watch('startTime')}
                onChange={(time) => {
                  if (errors.startTime) {
                    const [hour, minute] = time.split(':').map(Number)
                    const startDate = watch('startDate') as Date
                    startDate.setHours(hour)
                    startDate.setMinutes(minute)

                    if (startDate > currentDate()) {
                      clearErrors('startTime')
                    }
                  }

                  setValue('startTime', time)
                }}
              />
            </div>
          ) : null}
          {errors.startTime || errors.startDate ? (
            <span className='text-2xs text-pink font-bold ml-8'>
              {errors.startTime?.message || errors.startDate?.message}
            </span>
          ) : null}
        </div>

        {/** 예상 시간 (분) */}
        <div className='relative flex flex-col gap-8 mb-16'>
          <FormTitle required>예상 시간</FormTitle>
          <NumberInput
            className='pr-40'
            placeholder='예상되는 소요 시간을 알려주세요'
            addon={<span className='absolute right-16 top-10 text-sm text-black-default'>분</span>}
            error={errors.runningTime?.message}
            {...register('runningTime', {
              required: '필수 항목입니다',
            })}
          />
        </div>

        {/** 거리 (km) */}
        <div className='relative flex flex-col gap-8 mb-16'>
          <FormTitle required>거리</FormTitle>
          <NumberInput
            className='pr-40'
            placeholder='목표 거리를 입력하세요'
            addon={<span className='absolute right-16 top-10 text-sm text-black-default'>km</span>}
            error={errors.distance?.message}
            {...register('distance', {
              required: '필수 항목입니다',
            })}
          />
        </div>

        {/** 페이스 (n'mm") */}
        <div className='flex flex-col gap-8 mb-16'>
          <FormTitle required>페이스</FormTitle>
          <div className='flex gap-8'>
            <NumberInput
              placeholder='분'
              addon={
                <span className='absolute right-16 top-10 text-sm text-black-default font-bold italic'>{"'"}</span>
              }
              {...register('paceMinute', {
                required: '필수 항목입니다',
              })}
              error={errors.paceMinute?.message}
            />
            <NumberInput
              placeholder='초'
              addon={
                <span className='absolute right-16 top-10 text-sm text-black-default font-bold italic'>{'"'}</span>
              }
              {...register('paceSecond', {
                required: '필수 항목입니다',
              })}
              error={errors.paceSecond?.message}
            />
          </div>
        </div>

        {/** 참가 인원 */}
        <div className='relative flex flex-col gap-8 mb-16'>
          <FormTitle required>참가 인원</FormTitle>
          <NumberInput
            placeholder='3명 이상 입력하세요'
            error={errors.memberNumber?.message}
            {...register('memberNumber', {
              required: '필수 항목입니다',
              min: { value: 3, message: '3명 이상으로 입력하세요' },
              max: { value: 300, message: '300명 이하로 입력하세요' },
            })}
          />
        </div>

        {/** 뒷풀이 */}
        <div className='relative flex flex-col gap-8 mb-16'>
          <FormTitle required>뒷풀이</FormTitle>
          <div className='flex gap-8'>
            <Button
              className={clsx(
                'justify-center',
                watch('hasAfterRun') === true ? 'bg-primary/10 border-primary' : 'bg-white border-gray-default',
              )}
              onClick={() => setValue('hasAfterRun', true)}>
              유
            </Button>
            <Button
              className={clsx(
                'justify-center',
                watch('hasAfterRun') === false ? 'bg-primary/10 border-primary' : 'bg-white border-gray-default',
              )}
              onClick={() => setValue('hasAfterRun', false)}>
              무
            </Button>
          </div>
          {watch('hasAfterRun') ? (
            <TextArea
              placeholder='뒷풀이에 대한 내용을 입력하세요'
              className='h-80 pt-10'
              {...register('afterRunDescription')}
            />
          ) : null}
        </div>

        {/** 해시태그 */}
        <div className='relative flex flex-col gap-8 mb-80'>
          <FormTitle>해시태그</FormTitle>
          <div className='flex flex-wrap gap-8'>
            {watch('hashTags').map((label) => (
              <HashTag
                key={`HashTag-${label}`}
                label={label}
                onCloseButtonClick={() => {
                  setValue(
                    'hashTags',
                    watch('hashTags').filter((tag) => tag !== label),
                  )
                }}
              />
            ))}
          </div>
          <HashTagSearch
            onTagClick={(newTag) => {
              setValue('hashTags', watch('hashTags').concat(newTag))
            }}
          />
        </div>

        {/** 벙 만들기 버튼 */}
        <PrimaryButton type='submit' className='mb-40'>
          {isLoading ? <LoadingLogo color={colors.secondary} className='mx-auto' /> : '벙 만들기'}
        </PrimaryButton>
      </form>
    </section>
  )
}
