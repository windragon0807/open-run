import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { differenceInMinutes } from 'date-fns'
import { useForm } from 'react-hook-form'
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
import { BungInfo } from '@type/bung'
import { colors } from '@styles/colors'
import { formatDate } from '@utils/time'
import { useModifyBung } from '@apis/bungs/modifyBung/mutation'
import { useAlertStore } from '@store/alert'
import FormTitle from '../components/FormTitle'
import HashTagSearch from '../components/HashTagSearch'
import Button from '../components/Button'

type FormValues = {
  bungName: string
  description: string
  memberNumber: string
  hasAfterRun: boolean
  afterRunDescription: string
  hashTags: string[]
}

export default function ModifyBungModal({ details }: { details: BungInfo }) {
  const router = useRouter()
  const { closeModal } = useModalContext()
  const { mutate: modifyBung, isLoading } = useModifyBung()
  const 참여중인멤버수 = details.memberList.length
  const openAlert = useAlertStore((state) => state.openAlert)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      bungName: details.name,
      description: details.description,
      memberNumber: String(details.memberNumber),
      hasAfterRun: details.hasAfterRun,
      afterRunDescription: details.afterRunDescription,
      hashTags: details.hashtags,
    },
  })

  const onSubmit = (formData: FormValues) => {
    if (Number(formData.memberNumber) < 참여중인멤버수) {
      openAlert({
        title: '참가 인원 초과',
        description: '참가 인원은 참여 중인 멤버 수보다 적어야 합니다.',
      })
      return
    }

    const request = {
      bungId: details.bungId,
      name: formData.bungName,
      description: formData.description,
      memberNumber: Number(formData.memberNumber),
      hasAfterRun: formData.hasAfterRun,
      afterRunDescription: formData.hasAfterRun ? formData.afterRunDescription : '',
      hashtags: formData.hashTags,
    }

    modifyBung(request, {
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
        <form className='w-full flex flex-col overflow-y-auto px-16' onSubmit={handleSubmit(onSubmit)}>
          <section className='relative w-full mx-auto h-184 mb-32'>
            <Image className='rounded-8' src={details.mainImage as string} alt='Thumbnail Image' fill />
          </section>

          {/** 벙 이름 */}
          <div className='flex flex-col gap-8 mb-16'>
            <FormTitle required>벙 이름</FormTitle>
            <Input
              placeholder='벙 이름을 입력하세요'
              error={errors.bungName?.message}
              {...register('bungName', {
                required: '필수 항목입니다',
              })}
            />
          </div>

          {/** 설명 */}
          <div className='flex flex-col gap-8 mb-16'>
            <FormTitle>설명</FormTitle>
            <TextArea className='h-80 pt-10' placeholder='벙 설명을 입력하세요' {...register('description')} />
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
              value={differenceInMinutes(details.endDateTime, details.startDateTime)}
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
                value={details.pace.match(/\d+/g)?.[0]}
                disabled
                addon={
                  <span className='absolute right-16 bottom-10 text-sm text-gray-darken font-bold italic'>{"'"}</span>
                }
              />
              <NumberInput
                value={details.pace.match(/\d+/g)?.[1]}
                disabled
                addon={
                  <span className='absolute right-16 bottom-10 text-sm text-gray-darken font-bold italic'>{'"'}</span>
                }
              />
            </div>
          </div>

          {/** 참가 인원 */}
          <div className='relative flex flex-col gap-8 mb-16'>
            <FormTitle required>참가 인원</FormTitle>
            <NumberInput
              placeholder='3명 이상 입력하세요'
              error={errors.memberNumber?.message}
              {...register('memberNumber', {
                required: '필수 항목입니다',
                min: { value: 3, message: '3명 이상으로 입력하세요' },
                max: { value: 300, message: '300명 이하로 입력하세요' },
              })}
            />
          </div>

          {/** 뒷풀이 */}
          <div className='relative flex flex-col gap-8 mb-16'>
            <FormTitle required>뒷풀이</FormTitle>
            <div className='flex gap-8'>
              <Button
                className={`justify-center ${watch('hasAfterRun') === true ? 'bg-primary/10 border-primary' : 'bg-white border-gray-default'}`}
                onClick={() => {
                  setValue('hasAfterRun', true)
                }}>
                유
              </Button>
              <Button
                className={`justify-center ${watch('hasAfterRun') === false ? 'bg-primary/10 border-primary' : 'bg-white border-gray-default'}`}
                onClick={() => {
                  setValue('hasAfterRun', false)
                }}>
                무
              </Button>
            </div>
            {watch('hasAfterRun') ? (
              <TextArea
                className='h-80 pt-10'
                placeholder='뒷풀이에 대한 내용을 입력하세요'
                {...register('afterRunDescription')}
              />
            ) : null}
          </div>

          {/** 해시태그 */}
          <div className='relative flex flex-col gap-8 mb-80'>
            <FormTitle>해시태그</FormTitle>
            <div className='flex flex-wrap gap-8'>
              {watch('hashTags').map((label) => (
                <HashTag
                  key={`HashTag-${label}`}
                  label={label}
                  onCloseButtonClick={() => {
                    setValue(
                      'hashTags',
                      watch('hashTags').filter((tag) => tag !== label),
                    )
                  }}
                />
              ))}
            </div>
            <HashTagSearch
              onTagClick={(newTag) => {
                setValue('hashTags', watch('hashTags').concat(newTag))
              }}
            />
          </div>

          {/** 수정 완료 버튼 */}
          <PrimaryButton type='submit' className='mb-40'>
            {isLoading ? <LoadingLogo color={colors.secondary} className='mx-auto' /> : '수정 완료'}
          </PrimaryButton>
        </form>
      </section>
    </BottomSheet>
  )
}
