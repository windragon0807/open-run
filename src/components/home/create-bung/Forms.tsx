import { useThumbnailImage } from '@/hooks/useThumbnailImage'
import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppStore } from '@store/app'
import { imageList } from '@store/image'
import Button from '@components/bung/components/Button'
import FormTitle from '@components/bung/components/FormTitle'
import HashTagSearch from '@components/bung/components/HashTagSearch'
import DatePicker from '@shared/DatePicker'
import HashTag from '@shared/HashTag'
import Input from '@shared/Input'
import LoadingLogo from '@shared/LoadingLogo'
import NumberInput from '@shared/NumberInput'
import PrimaryButton from '@shared/PrimaryButton'
import TextArea from '@shared/TextArea'
import TimePicker from '@shared/TimePicker'
import CalendarIcon from '@icons/CalendarIcon'
import ClockIcon from '@icons/ClockIcon'
import RandomIcon from '@icons/RandomIcon'
import { useRefetchQuery } from '@hooks/useRefetchQuery'
import { useCreateBung } from '@apis/bungs/createBung/mutation'
import { queryKey } from '@apis/bungs/fetchMyBungs/query'
import { currentDate, formatDate } from '@utils/time'
import { colors } from '@styles/colors'
import AddressSearchModal from './AddressSearchModal'

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

export default function Forms({ nextStep }: { nextStep: () => void }) {
  const router = useRouter()
  const { isApp } = useAppStore()
  const { nextImage } = useThumbnailImage()

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
        router.push('/')
        nextStep()
      },
    })
  }

  const 시작날짜를선택했는가 = watch('startDate') != null
  const 시작시간을선택했는가 = watch('startTime') != null

  return (
    <section className='flex w-full flex-col overflow-y-auto px-16'>
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
        <section className='relative mx-auto mb-32 h-184 w-full'>
          <Image className='rounded-8' src={watch('imageUrl')} alt='Random Thumbnail Image' fill />
          <button
            type='button'
            className='absolute bottom-16 right-16 rounded-4 bg-primary p-8'
            onClick={() => nextImage({ onChange: (imageUrl) => setValue('imageUrl', imageUrl) })}>
            <RandomIcon size={24} color={colors.white} />
          </button>
        </section>

        {/** 벙 이름 */}
        <div className='mb-16 flex flex-col gap-8'>
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
        <div className='mb-16 flex flex-col gap-8'>
          <FormTitle>설명</FormTitle>
          <TextArea className='h-80 pt-10' placeholder='간단한 소개를 입력하세요' {...register('description')} />
        </div>

        {/** 장소 (주소검색 + 상세정보) */}
        <div className='mb-16 flex flex-col gap-8'>
          <FormTitle required>장소</FormTitle>
          <div className='flex w-full gap-8'>
            <div className='flex-1'>
              <Input className='disabled:bg-gray-default' placeholder='주소 검색' value={watch('location')} disabled />
            </div>
            <button
              type='button'
              className='h-40 w-80 place-items-center rounded-8 bg-primary text-14 font-semibold text-white'
              onClick={() => setAddressSearchModalOpen(true)}>
              주소 검색
            </button>
          </div>
          <Input placeholder='정확한 위치를 입력하세요' {...register('detailedAddress')} />
        </div>

        {/** 시작일시 (날짜선택 + 시간선택) */}
        <div ref={dateElementRef} className='relative mb-16 flex flex-col gap-8'>
          <FormTitle required>시작 일시</FormTitle>
          <div className='flex w-full gap-8'>
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
            <div className='flex w-full justify-center rounded-8 border border-gray-default bg-white p-16'>
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
            <div className='rounded-8 border border-gray-default bg-white p-16'>
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
            <span className='ml-8 text-12 font-bold text-pink'>
              {errors.startTime?.message || errors.startDate?.message}
            </span>
          ) : null}
        </div>

        {/** 예상 시간 (분) */}
        <div className='relative mb-16 flex flex-col gap-8'>
          <FormTitle required>예상 시간</FormTitle>
          <NumberInput
            className='pr-40'
            placeholder='예상되는 소요 시간을 알려주세요'
            addon={<span className='absolute right-16 top-10 text-14 text-black-default'>분</span>}
            error={errors.runningTime?.message}
            {...register('runningTime', {
              required: '필수 항목입니다',
            })}
          />
        </div>

        {/** 거리 (km) */}
        <div className='relative mb-16 flex flex-col gap-8'>
          <FormTitle required>거리</FormTitle>
          <NumberInput
            className='pr-40'
            placeholder='목표 거리를 입력하세요'
            addon={<span className='absolute right-16 top-10 text-14 text-black-default'>km</span>}
            error={errors.distance?.message}
            {...register('distance', {
              required: '필수 항목입니다',
            })}
          />
        </div>

        {/** 페이스 (n'mm") */}
        <div className='mb-16 flex flex-col gap-8'>
          <FormTitle required>페이스</FormTitle>
          <div className='flex gap-8'>
            <NumberInput
              placeholder='분'
              addon={
                <span className='absolute right-16 top-10 text-14 font-bold italic text-black-default'>{"'"}</span>
              }
              {...register('paceMinute', {
                required: '필수 항목입니다',
              })}
              error={errors.paceMinute?.message}
            />
            <NumberInput
              placeholder='초'
              addon={
                <span className='absolute right-16 top-10 text-14 font-bold italic text-black-default'>{'"'}</span>
              }
              {...register('paceSecond', {
                required: '필수 항목입니다',
              })}
              error={errors.paceSecond?.message}
            />
          </div>
        </div>

        {/** 참가 인원 */}
        <div className='relative mb-16 flex flex-col gap-8'>
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
        <div className='relative mb-16 flex flex-col gap-8'>
          <FormTitle required>뒷풀이</FormTitle>
          <div className='flex gap-8'>
            <Button
              className={clsx(
                'justify-center',
                watch('hasAfterRun') === true ? 'border-primary bg-primary/10' : 'border-gray-default bg-white',
              )}
              onClick={() => setValue('hasAfterRun', true)}>
              유
            </Button>
            <Button
              className={clsx(
                'justify-center',
                watch('hasAfterRun') === false ? 'border-primary bg-primary/10' : 'border-gray-default bg-white',
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
        <div className='relative mb-80 flex flex-col gap-8'>
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
        <PrimaryButton type='submit' className={isApp ? 'mb-60' : 'mb-40'}>
          {isLoading ? <LoadingLogo color={colors.secondary} className='mx-auto' /> : '벙 만들기'}
        </PrimaryButton>
      </form>
    </section>
  )
}
