'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'react-query'

import { RegisterStep, UserRegister } from '@models/register'
import { register } from '@apis/auth/register/api'
import Header from './Header'
import BottomButton from '../shared/BottomButton'
import Nickname from './nickname'
import Pace from './pace'
import Frequency from './frequency'
import Onboarding from './onboarding'
import Welcome from './welcome'

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
    if (step === 1 && isValid === false) {
      alert('다른 닉네임을 입력해주세요.')
      return
    }

    setStep((prev) => (prev + 1) as RegisterStep)
  }

  /* STEP 1 : Nickname */
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const 닉네임스텝에서버튼이비활성화상태인가 = step === 1 && isValid !== true

  const { mutate } = useMutation(register, {
    onSuccess: () => {
      route.replace('/')
    },
  })

  const handleSubmit = () => {
    if (step !== 4) return

    mutate(data)
  }

  return (
    <section className='w-full h-full flex flex-col max-w-tablet items-center bg-gray-lighten'>
      {step > 0 ? <Header step={step} onBackIconClick={handlePrevious} onSkipTextClick={() => setStep(4)} /> : null}

      {step === 0 ? <Welcome /> : null}

      {step === 1 ? (
        <Nickname
          nickname={data.nickname}
          setNickname={(value) => {
            setData((prev) => ({ ...prev, nickname: value }))
          }}
          isValid={isValid}
          setIsValid={setIsValid}
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

      {step === 4 ? <Onboarding nickname={data.nickname} /> : null}

      <section className='absolute bottom-40 w-full left-[50%] max-w-tablet -translate-x-1/2 px-16'>
        <BottomButton onClick={step === 4 ? handleSubmit : handleNext} disabled={닉네임스텝에서버튼이비활성화상태인가}>
          {step === 0 ? '시작하기' : null}
          {step === 1 || step === 2 || step === 3 ? '다음' : null}
          {step === 4 ? '홈으로' : null}
        </BottomButton>
      </section>
    </section>
  )
}
