import { useRef } from 'react'

import Spacing from '@shared/Spacing'
import { Pace, SingleNumber } from '@models/register'
import InputNumber from './InputNumber'

export default function Pace({ pace = `00'00"`, setPace }: { pace?: Pace; setPace: (pace: Pace) => void }) {
  const secondBox = useRef<HTMLInputElement>(null)
  const thirdBox = useRef<HTMLInputElement>(null)
  const fourthBox = useRef<HTMLInputElement>(null)

  return (
    <section className='w-full h-full bg-gray-lighten flex flex-col items-center'>
      <Spacing size={60 + 64} />
      <p className='text-4xl text-center'>평균 페이스를 알려주세요</p>
      <p className='text-4xl text-primary font-bold text-center'>나의 평균 페이스는</p>
      <Spacing size={40} />

      {/* 이 지점에 정대 코드 삽입 예정 */}
      <div className='flex items-start'>
        <InputNumber
          value={Number(pace[0]) as SingleNumber}
          setValue={(value) => {
            setPace(`${value}${pace[1]}'${pace[3]}${pace[4]}"` as Pace)
            secondBox.current?.focus()
          }}
          autoFocus
        />
        <Spacing direction='horizontal' size={10} />
        <InputNumber
          value={Number(pace[1]) as SingleNumber}
          setValue={(value) => {
            setPace(`${pace[0]}${value}'${pace[3]}${pace[4]}"` as Pace)
            thirdBox.current?.focus()
          }}
          ref={secondBox}
        />
        <Spacing direction='horizontal' size={5} />
        <QuotationMark />

        <Spacing direction='horizontal' size={10} />
        <InputNumber
          value={Number(pace[3]) as SingleNumber}
          setValue={(value) => {
            setPace(`${pace[0]}${pace[1]}'${value}${pace[4]}"` as Pace)
            fourthBox.current?.focus()
          }}
          ref={thirdBox}
        />
        <Spacing direction='horizontal' size={10} />
        <InputNumber
          value={Number(pace[4]) as SingleNumber}
          setValue={(value) => {
            setPace(`${pace[0]}${pace[1]}'${pace[3]}${value}"` as Pace)
            fourthBox.current?.blur()
          }}
          ref={fourthBox}
        />
        <Spacing direction='horizontal' size={5} />
        <DoubleQuotationMark />
      </div>
    </section>
  )
}

function QuotationMark() {
  return (
    <svg width='10' height='14' viewBox='0 0 10 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M9.79688 0L5.76562 13.3594H0.796875L3.14062 0H9.79688Z' fill='white' />
    </svg>
  )
}

function DoubleQuotationMark() {
  return (
    <svg width='21' height='14' viewBox='0 0 21 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M0.796875 13.3594L4.82812 0H9.79688L7.45312 13.3594H0.796875ZM11.2031 13.3594L15.2344 0H20.2031L17.8594 13.3594H11.2031Z'
        fill='white'
      />
    </svg>
  )
}
