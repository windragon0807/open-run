'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { UserRegister } from '@/models/user'
import Header from './Header'
import NextButton from './NextButton'
import Hello from './Hello'
import Nickname from './Nickname'
import Pace from './Pace'
import Frequency from './Frequency'
import Welcome from './Welcome'
import Spacing from '../shared/Spacing'

type RegisterStep = 0 | 1 | 2 | 3 | 4

export default function Register() {
  const route = useRouter()

  const [step, setStep] = useState<RegisterStep>(0)
  const handleStepDecrease = () => {
    if (step === 0) {
      route.replace('/signin')
      return
    }

    setStep((prev) => (prev - 1) as RegisterStep)
  }
  const handleStepIncrease = () => {
    if (step === 4) {
      // TODO 홈 화면 개발하기 시작하면 홈 화면으로 이동
      route.replace('/signin')
      return
    }

    setStep((prev) => (prev + 1) as RegisterStep)
  }

  const 건너뛰기버튼이보이는단계인가 = step === 2 || step === 3
  const handleSkipStep = () => {
    setStep(4)
  }

  const [data, setData] = useState<UserRegister>({
    nickname: '',
  })
  const [isValid, setIsValid] = useState<boolean | null>(null)

  // TODO 닉네임 중복확인 API 스로틀링 적용 (2글자 이상일 때부터 호출)

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Header onIconClick={handleStepDecrease} />

      {step === 0 ? <Hello /> : null}
      {step === 1 ? (
        <Nickname
          nickname={data.nickname}
          setNickname={(value) => setData((prev) => ({ ...prev, nickname: value }))}
          isValid={isValid}
        />
      ) : null}
      {step === 2 ? <Pace /> : null}
      {step === 3 ? <Frequency /> : null}
      {step === 4 ? <Welcome /> : null}

      <section className='fixed bottom-25 h-100 left-[50%] -translate-x-1/2'>
        <NextButton onClick={handleStepIncrease}>다음</NextButton>
        <Spacing size={10} />
        {건너뛰기버튼이보이는단계인가 ? (
          <button className='w-full text-white text-base mx-auto' onClick={handleSkipStep}>
            건너뛰기
          </button>
        ) : null}
      </section>
    </section>
  )
}
