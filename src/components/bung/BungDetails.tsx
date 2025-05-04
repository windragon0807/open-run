import { useAppRouter } from '@/hooks/useAppRouter'
import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Fragment, useRef } from 'react'
import { useModalContext } from '@contexts/ModalContext'
import { useAppStore } from '@store/app'
import { useUserStore } from '@store/user'
import { BungInfo } from '@type/bung'
import PrimaryButton from '@shared/PrimaryButton'
import ArrowLeftIcon from '@icons/ArrowLeftIcon'
import ArrowRightIcon from '@icons/ArrowRightIcon'
import CalendarIcon from '@icons/CalendarIcon'
import ChangeOwnerIcon from '@icons/ChangeOwnerIcon'
import PencilIcon from '@icons/PencilIcon'
import PersonIcon from '@icons/PersonIcon'
import PlaceIcon from '@icons/PlaceIcon'
import RunnerIcon from '@icons/RunnerIcon'
import WastebasketIcon from '@icons/WastebasketIcon'
import { useRefetch } from '@hooks/useRefetch'
import useTimer from '@hooks/useTimer'
import { useCompleteBung } from '@apis/bungs/completeBung/mutation'
import { useDropoutMember } from '@apis/bungs/dropoutMember/mutation'
import { useJoinBung } from '@apis/bungs/joinBung/mutation'
import { currentDate, formatDate, timerFormat } from '@utils/time'
import { colors } from '@styles/colors'
import Map from './Map'
import BungCompleteModal from './modal/BungCompleteModal'
import CertifyParticipationModal from './modal/CertifyParticipationModal'
import DeleteBungModal from './modal/DeleteBungModal'
import ModifyBungModal from './modal/ModifyBungModal'
import WhyCertificationModal from './modal/WhyCertificationModal'
import { PageCategory } from './types'

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
  const appRouter = useAppRouter()
  const { isApp } = useAppStore()
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
    <section className='relative h-full w-full'>
      <header
        className={clsx('absolute flex h-60 w-full items-center justify-between px-16', isApp && 'top-50')}
        onClick={handleScrollToTop}>
        <button onClick={() => appRouter.push('/')}>
          <ArrowLeftIcon size={24} color={colors.white} />
        </button>
        <div className='flex items-center gap-12'>
          {벙에참여한멤버인가 && (
            <button className='text-14 text-white' onClick={handleExit}>
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
      <div
        className={clsx('w-full cursor-pointer bg-cover', isApp ? 'h-240' : 'h-200')}
        style={{ backgroundImage: `url(${details.mainImage})` }}
      />

      <motion.section
        style={{ y: translateY }}
        className='relative h-full w-full rounded-[8px_8px_0_0] bg-gray-lighten bg-cover'>
        {벙에참여한유저인가 && (
          <div
            className={clsx(
              'absolute -top-32 -z-[1] flex h-40 w-full justify-between rounded-[8px_8px_0_0] px-16',
              벙이진행중인가 ? 'bg-gradient-transparent-secondary' : 'bg-pink/60',
            )}>
            <span
              className={clsx(
                'relative top-6 text-14 font-bold italic',
                벙이진행중인가 ? 'font-jost font-black text-secondary' : 'text-white',
              )}>
              {벙이진행중인가 ? 'Run Started!' : formattedTime}
            </span>
            {!벙이진행중인가 && <span className='relative top-6 text-14 text-white'>시작까지 남은 시간</span>}
          </div>
        )}

        <section
          ref={containerRef}
          className='overflow-y-auto rounded-[8px_8px_0_0] bg-gray-lighten'
          style={{ height: 벙에참여한유저인가 ? 'calc(100% - 80px)' : 'calc(100% - 50px)' }}>
          <div className='mb-24 rounded-8 bg-white p-16 shadow-floating-primary'>
            {/* 벙 이름 */}
            <span className='mb-16 inline-block text-20 font-bold text-black-default'>{details.name}</span>

            {/* 벙 위치 */}
            <div className='mb-8 flex items-center gap-8'>
              <PlaceIcon size={16} color={colors.black.default} />
              <span className='text-14 text-black-default'>{details.location}</span>
            </div>

            {/* 벙 시작 날짜 및 시간 */}
            <div className='mb-8 flex items-center gap-8'>
              <CalendarIcon size={16} color={colors.black.default} />
              <span className='text-14 text-black-default'>
                {formatDate(details.startDateTime, 'M월 d일 (E) a h:mm')}
              </span>
            </div>

            {/* 벙 거리 및 페이스 */}
            <div className='mb-8 flex items-center gap-8'>
              <RunnerIcon size={16} color={colors.black.default} />
              <span className='text-14 text-black-default'>{`${details.distance} km ${details.pace}`}</span>
            </div>

            {/* 벙 참여 인원 및 남은 자리 */}
            <div className='mb-24 flex items-center gap-8'>
              <PersonIcon size={16} color={colors.black.default} />
              <div className='flex items-center gap-4'>
                <span className='text-14 text-black-default'>{`${참여인원수} / ${details.memberNumber}`}</span>
                <span className='rounded-4 bg-pink/10 px-4 py-2 text-12 font-bold text-pink'>{`${details.memberNumber - 참여인원수}자리 남았어요`}</span>
              </div>
            </div>
            {벙에참여한유저인가 ? (
              <Fragment>
                <div className='mb-8 flex h-56 w-full items-center justify-between rounded-8 border border-black-darken pl-16 pr-8'>
                  <p className='whitespace-pre-line text-start text-12 font-bold text-black-darken'>
                    {벙에참여한벙주인가
                      ? '러닝 시작 전, 모든 멤버가 모이면\n참여 인증을 안내해 주세요'
                      : '러닝 시작 전, 벙주의 안내에 따라\n참여 인증을 해주세요'}
                  </p>
                  <button
                    className='rounded-8 bg-black-darken px-14 py-10 text-14 font-bold text-white disabled:bg-gray-default disabled:text-white'
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
                  className='flex h-32 w-full items-center justify-between rounded-8 bg-gray-lighten px-16'
                  onClick={() => {
                    openModal({
                      contents: <WhyCertificationModal />,
                    })
                  }}>
                  <p className='text-12 font-bold text-black-darken'>참여 인증을 왜 해야 하나요?</p>
                  <ArrowRightIcon size={16} color={colors.black.darken} />
                </button>
                {벙에참여한벙주인가 && (
                  <>
                    <button
                      className='mt-16 h-56 w-full rounded-8 bg-black-darken text-16 font-bold text-white disabled:bg-gray-default disabled:text-white'
                      disabled={벙이진행중인가 === false}
                      onClick={handleBungComplete}>
                      벙 완료
                    </button>
                    {벙이진행중인가 === false && (
                      <p className='mt-4 text-center text-12 font-semibold text-gray-darken'>
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
          <div className='mb-24 flex flex-col gap-8'>
            <div className='flex w-full items-center justify-between px-16'>
              <span className='text-16 font-bold text-black-darken'>{참여인원수}명이 함께 뛸 예정이에요</span>
              {벙에참여한벙주인가 && (
                <button className='text-14 font-normal text-black-darken' onClick={() => setPageCategory('멤버관리')}>
                  멤버관리
                </button>
              )}
            </div>
            <div className='flex gap-8 overflow-x-auto px-16'>
              {details.memberList.map((member) => (
                <div key={`${member.nickname}`} className='flex flex-col items-center gap-6'>
                  <div className='relative aspect-[1] w-76 rounded-8 bg-black-default'>
                    <Image src='/temp/nft_detail_2.png' alt='' fill sizes='100%' />
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-12 font-bold text-black-darken'>{member.nickname}</span>
                    {member.owner && <Image src='/images/icon_crown.png' alt='Crown Icon' width={16} height={18} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 벙 설명 */}
          <p className='w-full px-16 text-14 text-black-darken'>{details.description}</p>

          {/* 벙 뒷풀이 */}
          {details.hasAfterRun && (
            <>
              <h3 className='mt-24 pl-16 text-14 font-bold text-black-darken'>뒷풀이</h3>
              <p className='mt-4 pl-16 text-14 text-black-darken'>{details.afterRunDescription}</p>
            </>
          )}

          {/* 위치 및 지도 */}
          <div className='mb-8 mt-40 flex items-center gap-4 pl-16'>
            <PlaceIcon size={16} color={colors.black.default} />
            <span className='whitespace-pre-wrap text-14 font-bold text-black-darken'>{details.location}</span>
          </div>
          <div className='mb-18 px-16'>
            <Map location={details.location} />
          </div>

          {/* 해시태그 */}
          <div className={clsx('flex flex-wrap gap-8 px-16', isApp ? 'mb-100' : 'mb-80')}>
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
    <div className='flex w-fit items-center gap-8 rounded-4 bg-black-darken px-8 py-4'>
      <span className='text-14 text-white'>{label}</span>
    </div>
  )
}
