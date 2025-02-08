import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useState } from 'react'
import { useMutation } from 'react-query'
import { differenceInMinutes } from 'date-fns'
import { BottomSheet } from '@shared/Modal'
import BrokenXIcon from '@icons/BrokenXIcon'
import { useModalContext } from '@contexts/ModalContext'
import Input from '@shared/Input'
import NumberInput from '@shared/NumberInput'
import TextArea from '@shared/TextArea'
import PrimaryButton from '@shared/PrimaryButton'
import HashTag from '@shared/HashTag'
import LoadingLogo from '@shared/LoadingLogo'
import ClockIcon from '@icons/ClockIcon'
import CalendarIcon from '@icons/CalendarIcon'
import { createBung as _createBung } from '@apis/bungs/createBung/api'
import { BungDetail } from '@type/bung'
import { colors } from '@styles/colors'
import FormTitle from '../components/FormTitle'
import HashTagSearch from '../components/HashTagSearch'
import Button from '../components/Button'
import { formatDate } from '@utils/time'

type FormValues = {
  bungName: string
  description: string
  memberNumber: string
  hasAfterRun: boolean
  afterRunDescription: string
  hashTags: string[]
}

export default function ModifyBungModal({ details }: { details: BungDetail }) {
  const router = useRouter()
  const { closeModal } = useModalContext()

  const [formValues, setFormValues] = useState<FormValues>({
    bungName: details.name,
    description: details.description,
    memberNumber: String(details.memberNumber),
    hasAfterRun: details.hasAfterRun,
    afterRunDescription: details.afterRunDescription || '',
    hashTags: details.hashtags,
  })

  const handleFormValues = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const { mutate: createBung, isLoading } = useMutation(_createBung)
  const handleSubmit = () => {
    const { bungName, description, memberNumber, hasAfterRun, afterRunDescription } = formValues

    if (bungName === '') {
      alert('벙 이름을 입력해주세요')
      return
    }

    if (memberNumber == null || Number(memberNumber) < 1) {
      alert('참가 인원을 확인해주세요')
      return
    }

    const result = {
      name: bungName,
      description,
      location: details.location,
      startDateTime: details.startDateTime,
      endDateTime: details.endDateTime,
      distance: details.distance,
      pace: details.pace,
      memberNumber: Number(memberNumber),
      hasAfterRun,
      afterRunDescription: hasAfterRun ? afterRunDescription : '',
      hashtags: formValues.hashTags,
    }

    createBung(result, {
      onSuccess: () => {
        /* 벙 상세 페이지 서버 컴포넌트 API 호출 업데이트 */
        router.refresh()
        closeModal()
      },
    })
  }

  return (
    <BottomSheet fullSize>
      <header className='relative flex w-full h-60 justify-center items-center px-16'>
        <span className='text-[16px] leading-[24px] tracking-[-0.32px] font-bold'>벙 수정</span>
        <button className='absolute right-16' onClick={closeModal}>
          <BrokenXIcon size={24} color={colors.black.default} />
        </button>
      </header>

      <section className='h-[calc(100%-110px)] overflow-y-auto'>
        <section className='w-full flex flex-col overflow-y-auto px-16'>
          <section className='relative w-full mx-auto h-184 mb-32'>
            <Image className='rounded-8' src='/temp/img_thumbnail_1.png' alt='Thumbnail Image' fill />
          </section>

          {/** 벙 이름 */}
          <div className='flex flex-col gap-8 mb-16'>
            <FormTitle required>벙 이름</FormTitle>
            <Input
              name='bungName'
              type='text'
              placeholder='벙 이름을 입력하세요'
              value={formValues.bungName}
              onChange={handleFormValues}
            />
          </div>

          {/** 설명 */}
          <div className='flex flex-col gap-8 mb-16'>
            <FormTitle>설명</FormTitle>
            <TextArea
              className='h-80 pt-10'
              name='description'
              placeholder='벙 설명을 입력하세요'
              value={formValues.description}
              onChange={handleFormValues}
            />
          </div>

          {/** 장소 */}
          <div className='flex flex-col gap-8 mb-16'>
            <FormTitle>장소</FormTitle>
            <Input type='text' placeholder='정확한 위치를 입력하세요' value={details.location} disabled />
          </div>

          {/** 시작 일시 (날짜 선택 + 시간 선택) */}
          <div className='relative flex flex-col gap-8 mb-16'>
            <FormTitle>시작 일시</FormTitle>
            <div className='w-full flex gap-8'>
              <Button className='pl-16 bg-gray-default cursor-default'>
                <CalendarIcon size={16} color={colors.gray.darken} />
                <p className='text-gray-darken'>{formatDate(details.startDateTime, 'yyyy년 M월 d일')}</p>
              </Button>
              <Button className='pl-16 bg-gray-default cursor-default'>
                <ClockIcon size={16} color={colors.gray.darken} />
                <p className='text-gray-darken'>{formatDate(details.startDateTime, 'hh : mm')}</p>
              </Button>
            </div>
          </div>

          {/** 예상 시간 (분) */}
          <div className='relative flex flex-col gap-8 mb-16'>
            <FormTitle>예상 시간</FormTitle>
            <NumberInput
              className='pr-40'
              value={differenceInMinutes(new Date(details.endDateTime), new Date(details.startDateTime))}
              addon={<span className='absolute right-16 bottom-10 text-sm text-gray-darken'>분</span>}
              disabled
            />
          </div>

          {/** 거리 (km) */}
          <div className='relative flex flex-col gap-8 mb-16'>
            <FormTitle>거리</FormTitle>
            <NumberInput
              className='pr-40'
              value={details.distance}
              addon={<span className='absolute right-16 bottom-10 text-sm text-gray-darken'>km</span>}
              disabled
            />
          </div>

          {/** 페이스 (n'mm") */}
          <div className='flex flex-col gap-8 mb-16'>
            <FormTitle>페이스</FormTitle>
            <div className='flex gap-8'>
              <NumberInput
                value={details.pace.split("'")[0]}
                addon={
                  <span className='absolute right-16 bottom-10 text-sm text-gray-darken font-bold italic'>{"'"}</span>
                }
                disabled
              />
              <NumberInput
                value={details.pace.split("'")[1]}
                addon={
                  <span className='absolute right-16 bottom-10 text-sm text-gray-darken font-bold italic'>{'"'}</span>
                }
                disabled
              />
            </div>
          </div>

          {/** 참가 인원 */}
          <div className='relative flex flex-col gap-8 mb-16'>
            <FormTitle required>참가 인원</FormTitle>
            <NumberInput
              className='pl-40'
              name='memberNumber'
              placeholder='참가 인원을 입력하세요'
              value={formValues.memberNumber}
              onChange={handleFormValues}
              addon={<span className='absolute left-16 bottom-10 text-sm text-black-default'>1 ~</span>}
            />
          </div>

          {/** 뒷풀이 */}
          <div className='relative flex flex-col gap-8 mb-16'>
            <FormTitle required>뒷풀이</FormTitle>
            <div className='flex gap-8'>
              <Button
                className={`justify-center ${formValues.hasAfterRun === true ? 'bg-blue-transparent border-primary' : 'bg-white border-gray-default'}`}
                onClick={() => {
                  setFormValues((prev) => ({
                    ...prev,
                    hasAfterRun: true,
                  }))
                }}>
                유
              </Button>
              <Button
                className={`justify-center ${formValues.hasAfterRun === false ? 'bg-blue-transparent border-primary' : 'bg-white border-gray-default'}`}
                onClick={() => {
                  setFormValues((prev) => ({
                    ...prev,
                    hasAfterRun: false,
                  }))
                }}>
                무
              </Button>
            </div>
            {formValues.hasAfterRun ? (
              <TextArea
                name='afterRunDescription'
                placeholder='뒷풀이에 대한 내용을 입력하세요'
                className='h-80 pt-10'
                value={formValues.afterRunDescription}
                onChange={handleFormValues}
              />
            ) : null}
          </div>

          {/** 해시태그 */}
          <div className='relative flex flex-col gap-8 mb-80'>
            <FormTitle>해시태그</FormTitle>
            <div className='flex flex-wrap gap-8'>
              {formValues.hashTags.map((label) => (
                <HashTag
                  key={`HashTag-${label}`}
                  label={label}
                  onCloseButtonClick={() => {
                    setFormValues((prev) => ({
                      ...prev,
                      hashTags: prev.hashTags.filter((tag) => tag !== label),
                    }))
                  }}
                />
              ))}
            </div>
            <HashTagSearch
              onTagClick={(newTag) => {
                setFormValues((prev) => ({
                  ...prev,
                  hashTags: [...prev.hashTags, newTag],
                }))
              }}
            />
          </div>

          {/** 수정 완료 버튼 */}
          <PrimaryButton className='mb-40' onClick={handleSubmit}>
            {isLoading ? <LoadingLogo color={colors.secondary} className='mx-auto' /> : '수정 완료'}
          </PrimaryButton>
        </section>
      </section>
    </BottomSheet>
  )
}
