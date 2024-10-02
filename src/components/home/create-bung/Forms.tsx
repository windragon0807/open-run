'use client'

import { ChangeEvent, useCallback, useState } from 'react'
import { useMutation } from 'react-query'
import { useRouter } from 'next/navigation'

import Spacing from '@shared/Spacing'
import { useModalContext } from '@contexts/ModalContext'
import { createBung } from '@apis/bungs/createBung/api'
import AddressSearchModal from './AddressSearchModal'

type FormValues = {
  bungName: string
  description: string
  location: string
  locationDetail: string
  startTime: string
  distance: number
  pace: string
}

export default function Forms() {
  const router = useRouter()

  const [formValues, setFormValues] = useState<FormValues>({
    bungName: '',
    description: '',
    location: '',
    locationDetail: '',
    startTime: '',
    distance: 0,
    pace: '',
  })

  const handleFormValues = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const [isAddressSearchModalOpen, setAddressSearchModalOpen] = useState(false)

  const { mutate } = useMutation(createBung)
  const { closeModal } = useModalContext()

  const handleSubmit = () => {
    const { bungName, location, startTime, distance, pace } = formValues

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

    mutate(
      {
        name: bungName,
        description: '',
        location,
        startDateTime: new Date(startTime),
        endDateTime: new Date(startTime),
        distance,
        pace,
        memberNumber: 2,
        hasAfterRun: false,
        afterRunDescription: '',
      },
      {
        onSuccess: () => {
          router.refresh()
          closeModal()
        },
      },
    )
  }

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
            className={`${inputStyles} w-[calc(100%-88px)]`}
            value={formValues.location}
            onChange={handleFormValues}
            disabled
          />
          <button
            className='w-80 h-40 bg-primary rounded-8 text-white font-semibold place-items-center text-14'
            onClick={() => setAddressSearchModalOpen(true)}>
            주소 검색
          </button>
        </div>
        <input
          name='locationDetail'
          type='text'
          placeholder='상세 주소를 입력하세요'
          className={inputStyles}
          value={formValues.locationDetail}
          onChange={handleFormValues}
        />
      </div>
      <Spacing size={16} />
      <div className='flex flex-col gap-8'>
        <FormTitle required>시작 일시</FormTitle>
        <input
          name='startTime'
          type='text'
          placeholder='시작 일시를 입력하세요 (yyyy-mm-dd)'
          className={inputStyles}
          value={formValues.startTime}
          onChange={handleFormValues}
        />
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
