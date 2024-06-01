'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { RegisterStep, UserRegister } from '@models/register'
import Header from './Header'
import NextButton from './shared/NextButton'
import Nickname from './nickname/Nickname'
import Pace from './pace/Pace'
import Frequency from './frequency/Frequency'
import Done from './done'
import { useNicknameValidation } from './nickname/hooks/useNicknameValidation'
import Welcome from './welcome'
import { useMutation } from 'react-query'
import { register } from '@apis/auth/register/api'

export default function Register() {
  const route = useRouter()

  const [data, setData] = useState<UserRegister>({
    nickname: '',
  })

  const [step, setStep] = useState<RegisterStep>(0)
  const handlePrevious = () => {
    if (step === 0) {
      route.replace('/signin')
      return
    }

    setStep((prev) => (prev - 1) as RegisterStep)
  }
  const handleNext = () => {
    if (step === 4) return

    setStep((prev) => (prev + 1) as RegisterStep)
  }

  const { mutate } = useMutation(register, {
    onSuccess: () => {
      route.replace('/')
    },
  })

  const handleSubmit = () => {
    if (step !== 4) return

    mutate(data)
  }

  const [isValid, setIsValid] = useState<boolean | null>(null)
  const { handleNicknameChange } = useNicknameValidation()

  return (
    <section className='w-full h-full flex flex-col max-w-tablet items-center bg-gray-lighten'>
      {step > 0 ? <Header step={step} onBackIconClick={handlePrevious} onSkipTextClick={() => setStep(4)} /> : null}

      {step === 0 ? <Welcome /> : null}

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

      {step === 4 ? <Done /> : null}

      <section className='absolute bottom-40 w-full left-[50%] max-w-tablet -translate-x-1/2 px-16'>
        <NextButton onClick={step === 4 ? handleSubmit : handleNext}>
          {step === 0 ? '시작하기' : null}
          {step === 1 || step === 2 || step === 3 ? '다음' : null}
          {step === 4 ? '홈으로' : null}
        </NextButton>
      </section>
    </section>
  )
}
