'use client'

import { ChangeEvent, useCallback, useState } from 'react'
import { useMutation } from 'react-query'

import Spacing from '@shared/Spacing'
import { useModalContext } from '@contexts/ModalContext'
import { createBung } from '@apis/bungs/createBung/api'

type FormValues = {
  bungName: string
  location: string
  startTime: string
  distance: number
  pace: string
}

export default function Forms() {
  const [formValues, setFormValues] = useState<FormValues>({
    bungName: '',
    location: '',
    startTime: '',
    distance: 0,
    pace: '',
  })

  const handleFormValues = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [e.target.name]: e.target.value,
    }))
  }, [])

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
          closeModal()
        },
      },
    )
  }

  return (
    <section className='w-full flex flex-col overflow-y-auto'>
      <div className='flex flex-col gap-8'>
        <span className={labelStyles}>벙 이름</span>
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
        <span className={labelStyles}>장소</span>
        <input
          name='location'
          type='text'
          placeholder='장소를 입력하세요'
          className={inputStyles}
          value={formValues.location}
          onChange={handleFormValues}
        />
      </div>
      <Spacing size={16} />
      <div className='flex flex-col gap-8'>
        <span className={labelStyles}>시작 장소</span>
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
        <span className={labelStyles}>거리</span>
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
        <span className={labelStyles}>페이스</span>
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

const labelStyles: HTMLSpanElement['className'] =
  'text-[14px] leading-[24px] tracking-[-0.28px] text-bold text-black dark:text-white'
const inputStyles: HTMLSpanElement['className'] =
  'w-full h-40 bg-black-darkest px-16 rounded-8 dark:text-white dark:placeholder-black focus:border-gray focus:outline-none'
