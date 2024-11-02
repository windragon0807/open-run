import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

import Input from '@shared/Input'
import NumberInput from '@shared/NumberInput'
import TextArea from '@shared/TextArea'
import DatePicker from '@shared/DatePicker'
import TimePicker from '@shared/TimePicker'
import HashTag from '@shared/HashTag'
import LoadingLogo from '@shared/LoadingLogo'
import ClockIcon from '@icons/ClockIcon'
import CalendarIcon from '@icons/CalendarIcon'
import { createBung } from '@apis/bungs/createBung/api'
import AddressSearchModal from './AddressSearchModal'

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

export default function Forms({ nextStep }: { nextStep: () => void }) {
  const router = useRouter()

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

  const { mutate, isLoading } = useMutation(createBung)

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
      // TODO hashTags
    }

    mutate(result, {
      onSuccess: () => {
        router.refresh()
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
        <Image className='rounded-8' src='/temp/img_thumbnail_1.png' alt='Thumbnail Image' fill />
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
              className='disabled:bg-gray'
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
            className={`${시작날짜를선택했는가 ? 'border-primary bg-[var(--focusedBlue)]' : 'bg-white'} pl-16`}
            onClick={() => {
              setDatePickerOpen((prev) => !prev)
              if (isTimePickerOpen) setTimePickerOpen(false)
            }}>
            <CalendarIcon color={시작날짜를선택했는가 ? 'var(--primary)' : 'var(--black)'} />
            <p className={시작날짜를선택했는가 ? 'text-primary' : 'text-black'}>
              {시작날짜를선택했는가 ? format(formValues.startDate as Date, 'yyyy년 M월 d일') : '날짜 선택'}
            </p>
          </Button>
          <Button
            className={`${시작시간을선택했는가 ? 'border-primary bg-[var(--focusedBlue)]' : 'bg-white'} pl-16`}
            onClick={() => {
              setTimePickerOpen((prev) => !prev)
              if (isDatePickerOpen) setDatePickerOpen(false)
            }}>
            <ClockIcon color={시작시간을선택했는가 ? 'var(--primary)' : 'var(--black)'} />
            <p className={시작시간을선택했는가 ? 'text-primary' : 'text-black'}>
              {시작시간을선택했는가 ? (formValues.startTime as string).replace(':', ' : ') : '시간 선택'}
            </p>
          </Button>
        </div>

        {isDatePickerOpen ? (
          <div className='w-full flex justify-center bg-white p-16 rounded-8 border border-gray'>
            <DatePicker
              defaultValue={formValues.startDate}
              onDateClick={(date) => {
                setFormValues((prevFormValues) => ({
                  ...prevFormValues,
                  startDate: date,
                }))
              }}
            />
          </div>
        ) : null}
        {isTimePickerOpen ? (
          <div className='bg-white p-16 rounded-8 border border-gray'>
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
          addon={<span className='absolute right-16 bottom-10 text-sm text-black dark:text-white'>분</span>}
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
          addon={<span className='absolute right-16 bottom-10 text-sm text-black dark:text-white'>km</span>}
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
              <span className='absolute right-16 bottom-10 text-sm text-black font-bold italic dark:text-white'>
                {"'"}
              </span>
            }
          />
          <NumberInput
            name='paceSecond'
            placeholder='초'
            value={formValues.paceSecond}
            onChange={handleFormValues}
            addon={
              <span className='absolute right-16 bottom-10 text-sm text-black font-bold italic dark:text-white'>
                {'"'}
              </span>
            }
          />
        </div>
      </div>

      {/** 참가 인원 */}
      <div className='relative flex flex-col gap-8 mb-16'>
        <FormTitle required>참가 인원</FormTitle>
        <NumberInput
          className='pl-40'
          name='memberNumber'
          placeholder='참가 인원을 입력하세요'
          value={formValues.memberNumber}
          onChange={handleFormValues}
          addon={<span className='absolute left-16 bottom-10 text-sm text-black dark:text-white'>1 ~</span>}
        />
      </div>

      {/** 뒷풀이 */}
      <div className='relative flex flex-col gap-8 mb-16'>
        <FormTitle required>뒷풀이</FormTitle>
        <div className='flex gap-8'>
          <Button
            className={`justify-center ${formValues.hasAfterRun === true ? 'bg-[var(--focusedBlue)] border-primary' : 'bg-white border-gray'}`}
            onClick={() => {
              setFormValues((prev) => ({
                ...prev,
                hasAfterRun: true,
              }))
            }}>
            유
          </Button>
          <Button
            className={`justify-center ${formValues.hasAfterRun === false ? 'bg-[var(--focusedBlue)] border-primary' : 'bg-white border-gray'}`}
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
      <button className='w-full h-56 bg-primary rounded-8 mb-40' onClick={handleSubmit}>
        {isLoading ? (
          <LoadingLogo color='var(--secondary)' className='mx-auto' />
        ) : (
          <span className='text-[16px] text-white font-bold leading-[24px] tracking-[-0.32px]'>벙 만들기</span>
        )}
      </button>
    </section>
  )
}

function FormTitle({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <div className='relative w-fit'>
      <span className='text-sm leading-[24px] -tracking-[0.28px] font-bold text-black dark:text-white'>{children}</span>
      {required && (
        <svg className='absolute top-2 -right-6 fill-primary' width='4' height='4' viewBox='0 0 4 4' fill='none'>
          <circle cx='2' cy='2' r='2' />
        </svg>
      )}
    </div>
  )
}

function Button({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <button
      className={`flex-1 h-40 border border-gray rounded-8 flex items-center gap-8 text-sm font-semibold ${className}`}
      onClick={onClick}>
      {children}
    </button>
  )
}

function HashTagSearch({ onTagClick }: { onTagClick?: (tag: string) => void }) {
  const [inputValue, setInputValue] = useState('')
  const [recommendHashTags, setRecommendHashTags] = useState<string[]>([])

  // TODO 추천 태그 API 연동

  useEffect(() => {
    if (inputValue !== '') {
      setRecommendHashTags([`${inputValue} (직접 입력)`, '추천 태그 1', '추천 태그 2'])
    } else {
      setRecommendHashTags([])
    }
  }, [inputValue])

  return (
    <div className='relative'>
      <Input type='text' placeholder='해시태그를 입력하세요' value={inputValue} setValue={setInputValue} />
      <ul className='absolute -bottom-130 w-full rounded-8 bg-white shadow-shadow_white'>
        {recommendHashTags.map((tag) => (
          <li
            key={tag}
            className='text-sm text-black block py-10 pl-16 hover:text-primary cursor-pointer'
            onClick={() => {
              onTagClick?.(tag.replace(' (직접 입력)', ''))
              setInputValue('')
            }}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}
