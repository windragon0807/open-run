'use client'

import { useState } from 'react'
import { useMutation } from 'react-query'
import { useRouter } from 'next/navigation'

import Layout from '@shared/Layout'
import { RegisterStep, UserRegister } from '@type/register'
import { register as _register } from '@apis/users/register/api'
import ArrowLeftIcon from '@icons/ArrowLeftIcon'
import Welcome from './welcome'
import Pace from './pace'
import Onboarding from './onboarding'
import { NicknameValidState } from './nickname/types'
import Nickname from './nickname'
import Header from './Header'
import Frequency from './frequency'
import BottomButton from './BottomButton'
import { colors } from '@styles/colors'

export default function Register() {
  const route = useRouter()

  const [data, setData] = useState<UserRegister>({
    nickname: '',
    runningPace: "0'0",
    runningFrequency: 0,
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
    if (step === 1 && (isValid === 'overlap' || isValid === 'consonant')) {
      alert('다른 닉네임을 입력해주세요.')
      return
    }

    setStep((prev) => (prev + 1) as RegisterStep)
  }

  /* STEP 1 : Nickname */
  const [isValid, setIsValid] = useState<NicknameValidState>('default')
  const 닉네임스텝에서버튼이비활성화상태인가 = step === 1 && isValid !== 'pass'

  const { mutate: register } = useMutation(_register, {
    onSuccess: () => {
      route.replace('/')
    },
  })

  const handleSubmit = () => {
    if (step !== 4) return

    register(data)
  }

  return (
    <Layout className={step === 0 ? 'bg-gradient-primary-white' : 'bg-gray-lighten'}>
      <section className='relative w-full h-full flex flex-col max-w-tablet items-center'>
        {step > 0 ? <Header step={step} onBackIconClick={handlePrevious} onSkipTextClick={() => setStep(4)} /> : null}
        {step === 0 ? (
          <button className='absolute top-0 left-0 z-[10] pl-16 h-60' onClick={handlePrevious}>
            <ArrowLeftIcon size={40} color={colors.white} />
          </button>
        ) : null}

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
          <Pace
            pace={data.runningPace ?? ''}
            setPace={(value) => setData((prev) => ({ ...prev, runningPace: value }))}
          />
        ) : null}

        {step === 3 ? (
          <Frequency
            frequency={data.runningFrequency}
            setFrequency={(value) => setData((prev) => ({ ...prev, runningFrequency: value }))}
          />
        ) : null}

        {step === 4 ? <Onboarding nickname={data.nickname} /> : null}

        <section className='absolute bottom-40 w-full max-w-tablet left-[50%] -translate-x-1/2 px-16'>
          <BottomButton
            onClick={step === 4 ? handleSubmit : handleNext}
            disabled={닉네임스텝에서버튼이비활성화상태인가}>
            {step === 0 ? '시작하기' : null}
            {step === 1 || step === 2 || step === 3 ? '다음' : null}
            {step === 4 ? '홈으로' : null}
          </BottomButton>
        </section>
      </section>
    </Layout>
  )
}
