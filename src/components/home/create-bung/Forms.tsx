'use client'

import { ChangeEvent, ReactNode, useCallback, useState } from 'react'
import { useMutation } from 'react-query'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

import Spacing from '@shared/Spacing'
import DatePicker from '@shared/DatePicker'
import TimePicker from '@shared/TimePicker'
import { useModalContext } from '@contexts/ModalContext'
import { createBung } from '@apis/bungs/createBung/api'
import CalendarIcon from '@icons/CalendarIcon'
import ClockIcon from '@icons/ClockIcon'
import AddressSearchModal from './AddressSearchModal'

type FormValues = {
  bungName: string
  description: string
  location: string
  detailedAddress: string
  startDate?: Date
  startTime?: string // 'hh:mm'
  distance: number
  pace: string
}

export default function Forms() {
  const router = useRouter()

  const [formValues, setFormValues] = useState<FormValues>({
    bungName: '',
    description: '',
    location: '',
    detailedAddress: '',
    distance: 0,
    pace: '',
  })

  const handleFormValues = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const { mutate } = useMutation(createBung)
  const { closeModal } = useModalContext()

  const handleSubmit = () => {
    const { bungName, description, location, startTime, distance, pace } = formValues

    if (bungName === '') {
      alert('벙 이름을 입력해주세요')
      return
    }

    if (location === '') {
      alert('장소를 입력해주세요')
      return
    }

    if (startTime === '') {
      alert('시작 일시를 입력해주세요')
      return
    }

    if (distance === 0) {
      alert('목표 거리를 입력해주세요')
      return
    }

    if (pace === '') {
      alert('페이스를 입력해주세요')
      return
    }

    const result = {
      name: bungName,
      description,
      location: `${location} ${formValues.detailedAddress}`,
      startDateTime: new Date(),
      endDateTime: new Date(),
      distance,
      pace,
      memberNumber: 2,
      hasAfterRun: false,
      afterRunDescription: '',
    }
    console.log('ryong', result)

    // mutate(result, {
    //   onSuccess: () => {
    //     router.refresh()
    //     closeModal()
    //   },
    // })
  }

  const [isAddressSearchModalOpen, setAddressSearchModalOpen] = useState(false)
  const [isDatePickerOpen, setDatePickerOpen] = useState(false)
  const [isTimePickerOpen, setTimePickerOpen] = useState(false)

  const 시작날짜를선택했는가 = formValues.startDate != null
  const 시작시간을선택했는가 = formValues.startTime != null

  return (
    <section className='w-full flex flex-col overflow-y-auto'>
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

      <div className='flex flex-col gap-8'>
        <FormTitle required>벙 이름</FormTitle>
        <input
          name='bungName'
          type='text'
          placeholder='벙 이름을 입력하세요'
          className={inputStyles}
          value={formValues.bungName}
          onChange={handleFormValues}
        />
      </div>
      <Spacing size={16} />

      <div className='flex flex-col gap-8'>
        <FormTitle>설명</FormTitle>
        <textarea
          name='description'
          placeholder='벙 설명을 입력하세요'
          className={`${inputStyles} h-80 resize-none pt-10`}
          value={formValues.description}
          onChange={handleFormValues}
        />
      </div>
      <Spacing size={16} />

      <div className='flex flex-col gap-8'>
        <FormTitle required>장소</FormTitle>
        <div className='w-full flex gap-8'>
          <input
            name='location'
            type='text'
            placeholder='주소 검색'
            className={`${inputStyles} flex-1`}
            value={formValues.location}
            disabled
          />
          <button
            className='w-80 h-40 bg-primary rounded-8 text-white font-semibold place-items-center text-14'
            onClick={() => setAddressSearchModalOpen(true)}>
            주소 검색
          </button>
        </div>
        <input
          name='detailedAddress'
          type='text'
          placeholder='정확한 위치를 입력하세요'
          className={inputStyles}
          value={formValues.detailedAddress}
          onChange={handleFormValues}
        />
      </div>
      <Spacing size={16} />

      <div className='relative flex flex-col gap-8'>
        <FormTitle required>시작 일시</FormTitle>
        <div className='w-full flex gap-8'>
          <StartDateButton
            className={시작날짜를선택했는가 ? 'border-primary bg-[rgba(74,92,239,0.10)]' : 'bg-white'}
            onClick={() => {
              setDatePickerOpen((prev) => !prev)
              if (isTimePickerOpen) setTimePickerOpen(false)
            }}>
            <CalendarIcon color={시작날짜를선택했는가 ? 'var(--primary)' : 'var(--black)'} />
            <p className={시작날짜를선택했는가 ? 'text-primary' : 'text-black'}>
              {시작날짜를선택했는가 ? format(formValues.startDate as Date, 'yyyy년 M월 d일') : '날짜 선택'}
            </p>
          </StartDateButton>
          <StartDateButton
            className={시작시간을선택했는가 ? 'border-primary bg-[rgba(74,92,239,0.10)]' : 'bg-white'}
            onClick={() => {
              setTimePickerOpen((prev) => !prev)
              if (isDatePickerOpen) setDatePickerOpen(false)
            }}>
            <ClockIcon color={시작시간을선택했는가 ? 'var(--primary)' : 'var(--black)'} />
            <p className={시작시간을선택했는가 ? 'text-primary' : 'text-black'}>
              {시작시간을선택했는가 ? (formValues.startTime as string).replace(':', ' : ') : '시간 선택'}
            </p>
          </StartDateButton>
        </div>
        {isDatePickerOpen ? (
          <div className='w-fit bg-white p-16 rounded-8 border border-gray'>
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
      <Spacing size={16} />

      <div className='relative flex flex-col gap-8'>
        <FormTitle required>거리</FormTitle>
        <input
          name='distance'
          type='text'
          placeholder='목표 거리를 입력하세요'
          className={inputStyles}
          value={formValues.distance}
          onChange={(e) => {
            // 숫자 또는 빈 문자열만 허용
            if (/^\d*$/.test(e.target.value)) {
              handleFormValues(e)
            }
          }}
        />
        <span className='absolute right-16 bottom-10 text-[14px] text-white'>km</span>
      </div>
      <Spacing size={16} />

      <div className='flex flex-col gap-8'>
        <FormTitle required>페이스</FormTitle>
        <input
          name='pace'
          type='pace'
          placeholder={`페이스를 입력하세요 (n'mm")`}
          className={inputStyles}
          value={formValues.pace}
          onChange={handleFormValues}
        />
      </div>
      <Spacing size={40} />

      <button className='w-full h-56 bg-primary rounded-8' onClick={handleSubmit}>
        <span className='text-[16px] text-white font-bold leading-[24px] tracking-[-0.32px]'>벙 만들기</span>
      </button>
    </section>
  )
}

const inputStyles: HTMLSpanElement['className'] =
  'w-full h-40 text-14 border border-gray dark:bg-black-darkest px-16 rounded-8 dark:text-white dark:placeholder-black focus:border-primary dark:focus:border-gray focus:outline-none'

function FormTitle({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <div className='relative w-fit'>
      <span className='text-14 leading-[24px] -tracking-[0.28px] font-bold text-black dark:text-white'>{children}</span>
      {required && (
        <svg className='absolute top-2 -right-6 fill-primary' width='4' height='4' viewBox='0 0 4 4' fill='none'>
          <circle cx='2' cy='2' r='2' />
        </svg>
      )}
    </div>
  )
}

function StartDateButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      className={`flex-1 h-40 border border-gray rounded-8 pl-16 flex items-center gap-8 text-14 font-semibold ${className}`}
      onClick={onClick}>
      {children}
    </button>
  )
}
