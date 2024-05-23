'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { RegisterStep, UserRegister } from '@models/register'
import Spacing from '@shared/Spacing'
import Header from './Header'
import NextButton from './shared/NextButton'
import Nickname from './nickname/Nickname'
import Pace from './pace/Pace'
import Frequency from './frequency/Frequency'
import Welcome from './welcome/Welcome'
import { useNicknameValidation } from './nickname/hooks/useNicknameValidation'
import Hello from './hello/Hello'
import { useMutation } from 'react-query'
import { register } from '@/apis/auth/register/api'

export default function Register() {
  const route = useRouter()

  const [data, setData] = useState<UserRegister>({
    nickname: '',
  })

  const [step, setStep] = useState<RegisterStep>(0)
  const handleStepDecrease = () => {
    if (step === 0) {
      route.replace('/signin')
      return
    }

    setStep((prev) => (prev - 1) as RegisterStep)
  }
  const handleStepIncrease = () => {
    if (step === 4) return

    setStep((prev) => (prev + 1) as RegisterStep)
  }

  const { mutate } = useMutation(register, {
    onSuccess: (data) => {
      console.log('ryong', data)
      route.replace('/')
    },
  })

  const handleSubmit = () => {
    if (step !== 4) return

    mutate(data)
  }

  const 건너뛰기버튼이보이는단계인가 = step === 2 || step === 3
  const handleSkipStep = () => {
    setStep(4)
  }

  const [isValid, setIsValid] = useState<boolean | null>(null)
  const { handleNicknameChange } = useNicknameValidation()

  return (
    <section className='w-full h-full flex flex-col justify-center items-center bg-white'>
      <Header step={step} onIconClick={handleStepDecrease} />

      {step === 0 ? <Hello /> : null}
      {step === 1 ? (
        <Nickname
          nickname={data.nickname}
          setNickname={(value) => {
            setData((prev) => ({ ...prev, nickname: value }))
            handleNicknameChange(value, setIsValid)
          }}
          isValid={isValid}
        />
      ) : null}
      {step === 2 ? (
        <Pace pace={data.runningPace} setPace={(value) => setData((prev) => ({ ...prev, runningPace: value }))} />
      ) : null}
      {step === 3 ? (
        <Frequency
          frequency={data.runningFrequency}
          setFrequency={(value) => setData((prev) => ({ ...prev, runningFrequency: value }))}
        />
      ) : null}
      {step === 4 ? <Welcome /> : null}

      <section className='fixed bottom-25 w-full h-100 left-[50%] -translate-x-1/2 px-16'>
        <NextButton onClick={step === 4 ? handleSubmit : handleStepIncrease}>
          {step === 4 ? '합류하기' : '다음'}
        </NextButton>
        <Spacing size={10} />

        {건너뛰기버튼이보이는단계인가 ? (
          <button className='w-full text-base mx-auto' onClick={handleSkipStep}>
            건너뛰기
          </button>
        ) : null}
      </section>
    </section>
  )
}
