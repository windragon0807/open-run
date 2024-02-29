'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { UserRegister } from '@/models/user'
import Header from './Header'
import NextButton from './NextButton'
import Hello from './Hello'
import Nickname from './Nickname'

type RegisterStep = 0 | 1 | 2 | 3 | 4

export default function Register() {
  const route = useRouter()

  const [step, setStep] = useState<RegisterStep>(0)
  const handleStepDecrease = () => {
    if (step === 0) {
      route.replace('/signin')
      return
    }

    setStep(prev => (prev - 1) as RegisterStep)
  }
  const handleStepIncrease = () => {
    if (step === 4) return

    setStep(prev => (prev + 1) as RegisterStep)
  }

  const [data, setData] = useState<UserRegister>({
    nickname: '',
  })
  const [isValid, setIsValid] = useState<boolean | null>(null)

  // TODO 닉네임 중복확인 API 스로틀링 적용 (2글자 이상일 때부터 호출)

  return (
    <section className="w-full h-full flex flex-col justify-center items-center">
      <Header onIconClick={handleStepDecrease} />

      {step === 0 ? <Hello /> : null}
      {step === 1 ? (
        <Nickname
          nickname={data.nickname}
          setNickname={value => setData(prev => ({ ...prev, nickname: value }))}
          isValid={isValid}
        />
      ) : null}

      <section className="fixed bottom-50 left-[50%] -translate-x-1/2">
        <NextButton onClick={handleStepIncrease}>다음</NextButton>
        {/* TODO SkipButton */}
      </section>
    </section>
  )
}
