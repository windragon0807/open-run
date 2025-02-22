import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Fragment, useRef } from 'react'
import { useMutation } from 'react-query'
import { motion, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'
import { useModalContext } from '@contexts/ModalContext'
import ArrowLeftIcon from '@icons/ArrowLeftIcon'
import PlaceIcon from '@icons/PlaceIcon'
import CalendarIcon from '@icons/CalendarIcon'
import RunnerIcon from '@icons/RunnerIcon'
import PersonIcon from '@icons/PersonIcon'
import ArrowRightIcon from '@icons/ArrowRightIcon'
import { BungInfo } from '@type/bung'
import useTimer from '@hooks/useTimer'
import { currentDate, formatDate, timerFormat } from '@utils/time'
import { colors } from '@styles/colors'
import PrimaryButton from '@shared/PrimaryButton'
import PencilIcon from '@icons/PencilIcon'
import ChangeOwnerIcon from '@icons/ChangeOwnerIcon'
import WastebasketIcon from '@icons/WastebasketIcon'
import { useUserStore } from '@store/user'
import { useRefetch } from '@hooks/useRefetch'
import { useCompleteBung } from '@apis/bungs/completeBung/mutation'
import { useDropoutMember } from '@apis/bungs/dropoutMember/mutation'
import { useJoinBung } from '@apis/bungs/joinBung/mutation'
import Map from './Map'
import WhyCertificationModal from './modal/WhyCertificationModal'
import CertifyParticipationModal from './modal/CertifyParticipationModal'
import DeleteBungModal from './modal/DeleteBungModal'
import { PageCategory } from './types'
import ModifyBungModal from './modal/ModifyBungModal'
import BungCompleteModal from './modal/BungCompleteModal'

export default function BungDetails({
  details,
  isParticipated,
  isOwner,
  setPageCategory,
}: {
  details: BungInfo
  isParticipated: boolean
  isOwner: boolean
  setPageCategory: (category: PageCategory) => void
}) {
  const 참여인원수 = details.memberList.length

  const router = useRouter()
  const { openModal } = useModalContext()
  const { userInfo } = useUserStore()
  const clearAllCache = useRefetch()
  const { mutate: completeBung } = useCompleteBung()
  const { mutate: dropoutMember } = useDropoutMember()
  const { mutate: joinBung } = useJoinBung()

  /* 스크롤이 올라갈수록 컨텐츠 영역이 올라가는 효과를 주기 위한 로직 */
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    container: containerRef,
  })

  const handleScrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const translateY = useTransform(scrollY, [0, 200], [-15, isParticipated ? -108 : -140])

  /* 시작까지 남은 시간을 타이머로 표시하기 위한 로직 */
  const { days, hours, minutes, seconds } = useTimer(details.startDateTime)
  const formattedTime = timerFormat({ days, hours, minutes, seconds })

  const handleBungComplete = () => {
    completeBung(
      { bungId: details.bungId },
      {
        onSuccess: () => {
          router.refresh()
          router.replace('/')

          openModal({
            contents: (
              <BungCompleteModal
                imageUrl={details.mainImage as string}
                title={details.name}
                location={details.location}
                memberList={details.memberList}
              />
            ),
          })
        },
      },
    )
  }

  const handleJoinBung = () => {
    if (window.confirm('벙에 참여하시겠습니까?')) {
      joinBung(
        { bungId: details.bungId },
        {
          onSuccess: () => {
            router.refresh()
          },
        },
      )
    }
  }

  const handleExit = () => {
    dropoutMember(
      { userId: userInfo!.userId, bungId: details.bungId },
      {
        onSuccess: () => {
          clearAllCache()
          router.replace('/')
        },
      },
    )
  }

  const 벙에참여한벙주인가 = isParticipated && isOwner
  const 벙에참여한멤버인가 = isParticipated && !isOwner
  const 벙에참여한유저인가 = isParticipated
  const 현재유저의벙참여정보 = details.memberList.find((member) => member.userId === userInfo!.userId)
  const 벙이진행중인가 = details.startDateTime < currentDate()

  return (
    <section className='w-full h-full relative'>
      <header className='absolute w-full h-60 px-16 flex justify-between items-center' onClick={handleScrollToTop}>
        <Link href='/' onClick={(e) => e.stopPropagation()}>
          <ArrowLeftIcon size={24} color={colors.white} />
        </Link>
        <div className='flex gap-12 items-center'>
          {벙에참여한멤버인가 && (
            <button className='text-white text-14' onClick={handleExit}>
              참여 취소
            </button>
          )}
          {벙에참여한벙주인가 && (
            <>
              {/** 벙 수정 */}
              <button onClick={() => openModal({ contents: <ModifyBungModal details={details} /> })}>
                <PencilIcon size={24} color={colors.white} />
              </button>
              {/** 벙주 넘기기 */}
              <button onClick={() => setPageCategory('벙주 넘기기')}>
                <ChangeOwnerIcon size={24} color={colors.white} />
              </button>
              {/** 벙 삭제 */}
              <button onClick={() => openModal({ contents: <DeleteBungModal bungId={details.bungId} /> })}>
                <WastebasketIcon size={24} color={colors.white} />
              </button>
            </>
          )}
        </div>
      </header>
      <div className='w-full h-200 bg-cover cursor-pointer' style={{ backgroundImage: `url(${details.mainImage})` }} />

      <motion.section
        style={{ y: translateY }}
        className='relative w-full h-full bg-gray-lighten bg-cover rounded-[8px_8px_0_0]'>
        {벙에참여한유저인가 && (
          <div
            className={clsx(
              'absolute -top-32 -z-[1] w-full h-40 px-16 flex justify-between rounded-[8px_8px_0_0]',
              벙이진행중인가 ? 'bg-gradient-transparent-secondary' : 'bg-pink/60',
            )}>
            <span
              className={clsx(
                'relative italic text-14 font-bold top-6',
                벙이진행중인가 ? 'font-jost text-secondary font-black' : 'text-white',
              )}>
              {벙이진행중인가 ? 'Run Started!' : formattedTime}
            </span>
            {!벙이진행중인가 && <span className='relative text-14 text-white top-6'>시작까지 남은 시간</span>}
          </div>
        )}

        <section
          ref={containerRef}
          className='overflow-y-auto rounded-[8px_8px_0_0] bg-gray-lighten'
          style={{ height: 벙에참여한유저인가 ? 'calc(100% - 80px)' : 'calc(100% - 50px)' }}>
          <div className='p-16 bg-white shadow-floating-primary rounded-8 mb-24'>
            {/* 벙 이름 */}
            <span className='inline-block text-xl font-bold text-black-default mb-16'>{details.name}</span>

            {/* 벙 위치 */}
            <div className='flex gap-8 items-center mb-8'>
              <PlaceIcon size={16} color={colors.black.default} />
              <span className='text-sm text-black-default'>{details.location}</span>
            </div>

            {/* 벙 시작 날짜 및 시간 */}
            <div className='flex gap-8 items-center mb-8'>
              <CalendarIcon size={16} color={colors.black.default} />
              <span className='text-sm text-black-default'>
                {formatDate(details.startDateTime, 'M월 d일 (E) a h:mm')}
              </span>
            </div>

            {/* 벙 거리 및 페이스 */}
            <div className='flex gap-8 items-center mb-8'>
              <RunnerIcon size={16} color={colors.black.default} />
              <span className='text-sm text-black-default'>{`${details.distance} km ${details.pace}`}</span>
            </div>

            {/* 벙 참여 인원 및 남은 자리 */}
            <div className='flex gap-8 items-center mb-24'>
              <PersonIcon size={16} color={colors.black.default} />
              <div className='flex gap-4 items-center'>
                <span className='text-sm text-black-default'>{`${참여인원수} / ${details.memberNumber}`}</span>
                <span className='px-4 py-2 bg-pink/10 rounded-4 text-12 font-bold text-pink'>{`${details.memberNumber - 참여인원수}자리 남았어요`}</span>
              </div>
            </div>
            {벙에참여한유저인가 ? (
              <Fragment>
                <div className='w-full h-56 rounded-8 border border-black-darken pl-16 pr-8 flex items-center justify-between mb-8'>
                  <p className='text-start text-12 text-black-darken font-bold whitespace-pre-line'>
                    {벙에참여한벙주인가
                      ? '러닝 시작 전, 모든 멤버가 모이면\n참여 인증을 안내해 주세요'
                      : '러닝 시작 전, 벙주의 안내에 따라\n참여 인증을 해주세요'}
                  </p>
                  <button
                    className='bg-black-darken px-14 py-10 rounded-8 text-sm text-white font-bold disabled:bg-gray-default disabled:text-white'
                    disabled={현재유저의벙참여정보?.participationStatus === true}
                    onClick={() => {
                      openModal({
                        contents: <CertifyParticipationModal destination={details.location} bungId={details.bungId} />,
                      })
                    }}>
                    참여 인증
                  </button>
                </div>
                <button
                  className='w-full h-32 rounded-8 px-16 bg-gray-lighten flex items-center justify-between'
                  onClick={() => {
                    openModal({
                      contents: <WhyCertificationModal />,
                    })
                  }}>
                  <p className='text-12 text-black-darken font-bold'>참여 인증을 왜 해야 하나요?</p>
                  <ArrowRightIcon size={16} color={colors.black.darken} />
                </button>
                {벙에참여한벙주인가 && (
                  <>
                    <button
                      className='w-full h-56 rounded-8 bg-black-darken text-base font-bold text-white mt-16 disabled:bg-gray-default disabled:text-white'
                      disabled={벙이진행중인가 === false}
                      onClick={handleBungComplete}>
                      벙 완료
                    </button>
                    {벙이진행중인가 === false && (
                      <p className='text-12 font-semibold text-gray-darken mt-4 text-center'>
                        {formatDate(details.endDateTime, 'M/d a h:mm')} 이후에 버튼이 활성화됩니다
                      </p>
                    )}
                  </>
                )}
              </Fragment>
            ) : (
              <PrimaryButton disabled={details.memberNumber - 참여인원수 > 0} onClick={handleJoinBung}>
                참여하기
              </PrimaryButton>
            )}
          </div>

          {/* N명이 함께 뛸 예정이에요 */}
          <div className='flex flex-col gap-8 mb-24'>
            <div className='w-full flex justify-between items-center px-16'>
              <span className='text-base font-bold text-black-darken'>{참여인원수}명이 함께 뛸 예정이에요</span>
              {벙에참여한벙주인가 && (
                <button className='text-sm font-normal text-black-darken' onClick={() => setPageCategory('멤버관리')}>
                  멤버관리
                </button>
              )}
            </div>
            <div className='flex gap-8 overflow-x-auto px-16'>
              {details.memberList.map((member) => (
                <div key={`${member.nickname}`} className='flex flex-col gap-6 items-center'>
                  <div className='relative w-76 aspect-[1] bg-black-default rounded-8'>
                    <Image src='/temp/nft_detail_2.png' alt='' fill sizes='100%' />
                  </div>
                  <div className='flex gap-4 items-center'>
                    <span className='text-12 font-bold text-black-darken'>{member.nickname}</span>
                    {member.owner && <Image src='/images/icon_crown.png' alt='Crown Icon' width={16} height={18} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 벙 설명 */}
          <p className='w-full px-16 text-sm text-black-darken'>{details.description}</p>

          {/* 벙 뒷풀이 */}
          {details.hasAfterRun && (
            <>
              <h3 className='text-sm text-black-darken font-bold pl-16 mt-24'>뒷풀이</h3>
              <p className='text-sm text-black-darken pl-16 mt-4'>{details.afterRunDescription}</p>
            </>
          )}

          {/* 위치 및 지도 */}
          <div className='flex items-center gap-4 pl-16 mt-40 mb-8'>
            <PlaceIcon size={16} color={colors.black.default} />
            <span className='text-sm text-black-darken font-bold whitespace-pre-wrap'>{details.location}</span>
          </div>
          <div className='px-16 mb-18'>
            <Map location={details.location} />
          </div>

          {/* 해시태그 */}
          <div className='flex flex-wrap gap-8 px-16 mb-80'>
            {details.hashtags.map((label) => (
              <HashTag key={label} label={label} />
            ))}
          </div>
        </section>
      </motion.section>
    </section>
  )
}

function HashTag({ label }: { label: string }) {
  return (
    <div className='flex w-fit items-center gap-8 px-8 py-4 bg-black-darken rounded-4'>
      <span className='text-white text-14'>{label}</span>
    </div>
  )
}
