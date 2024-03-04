import { useRef } from 'react'

import Spacing from '@shared/Spacing'
import { Pace, SingleNumber } from '@/models/register'
import Title from '../shared/Title'
import SubTitle from '../shared/SubTitle'
import Emoji from '../shared/Emoji'
import InputNumber from './InputNumber'

type Props = {
  pace?: Pace
  setPace: (pace: Pace) => void
}

export default function Pace({ pace = `00'00"`, setPace }: Props) {
  const secondBox = useRef<HTMLInputElement>(null)
  const thirdBox = useRef<HTMLInputElement>(null)
  const fourthBox = useRef<HTMLInputElement>(null)

  return (
    <section className='flex flex-col items-center'>
      <Emoji>🏃🏻‍♂️</Emoji>
      <Spacing size={20} />
      <Title>달리기 속도가 어떻게 되나요?</Title>
      <Spacing size={10} />
      <SubTitle>평균 페이스를 입력해주세요.</SubTitle>
      <Spacing size={20} />

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
