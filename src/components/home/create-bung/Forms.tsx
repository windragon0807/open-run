'use client'

import { ChangeEvent, useCallback, useState } from 'react'

import Spacing from '@shared/Spacing'

type FormValues = {
  bungName: string
  place: string
  startTime: string
  distance: number
  pace: string
}

export default function Forms() {
  const [formValues, setFormValues] = useState<FormValues>({
    bungName: '',
    place: '',
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

  const handleSubmit = () => {
    const { bungName, place, startTime, distance, pace } = formValues

    if (bungName === '') {
      alert('벙 이름을 입력해주세요')
      return
    }

    if (place === '') {
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
          name='place'
          type='text'
          placeholder='장소를 입력하세요'
          className={inputStyles}
          value={formValues.place}
          onChange={handleFormValues}
        />
      </div>
      <Spacing size={16} />
      <div className='flex flex-col gap-8'>
        <span className={labelStyles}>시작 장소</span>
        <input
          name='startTime'
          type='text'
          placeholder='시작 일시를 입력하세요'
          className={inputStyles}
          value={formValues.startTime}
          onChange={handleFormValues}
        />
      </div>
      <Spacing size={16} />
      <div className='flex flex-col gap-8'>
        <span className={labelStyles}>거리</span>
        <input
          name='distance'
          type='distance'
          placeholder='목표 거리를 입력하세요'
          className={inputStyles}
          value={formValues.distance}
          onChange={handleFormValues}
        />
      </div>
      <Spacing size={16} />
      <div className='flex flex-col gap-8'>
        <span className={labelStyles}>페이스</span>
        <input
          name='startTime'
          type='pace'
          placeholder='페이스를 입력하세요'
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
