import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Fragment, useRef } from 'react'
import { useMutation } from 'react-query'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ko } from 'date-fns/locale'
import { format } from 'date-fns'
import { useModalContext } from '@contexts/ModalContext'
import BackIcon from '@icons/BackIcon'
import PlaceIcon from '@icons/PlaceIcon'
import CalendarIcon from '@icons/CalendarIcon'
import RunnerIcon from '@icons/RunnerIcon'
import PersonIcon from '@icons/PersonIcon'
import ArrowRight from '@icons/ArrowRight'
import { BungDetail } from '@/types/bung'
import useTimer from '@hooks/useTimer'
import { convertStringTimeToDate } from '@utils/time'
import { padStart } from '@utils/string'
import { colors } from '@styles/colors'
import Map from './Map'
import WhyCertificationModal from './modal/WhyCertificationModal'
import CertifyParticipationModal from './modal/CertifyParticipationModal'
import DeleteBungModal from './modal/DeleteBungModal'
import { PageCategory } from './types'
import { completeBung as _completeBung } from '@apis/bungs/completeBung/api'
import ModifyBungModal from './modal/ModifyBungModal'
import BungCompleteModal from './modal/BungCompleteModal'
import PrimaryButton from '@shared/PrimaryButton'
import { joinBung as _joinBung } from '@apis/bungs/joinBung/api'

export default function BungDetails({
  details,
  isParticipated,
  isOwner,
  setPageCategory,
}: {
  details: BungDetail
  isParticipated: boolean
  isOwner: boolean
  setPageCategory: (category: PageCategory) => void
}) {
  const 참여인원수 = details.memberList.length

  const router = useRouter()
  const { openModal } = useModalContext()

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
  const { days, hours, minutes, seconds } = useTimer(convertStringTimeToDate(details.startDateTime))
  const formattedTime = `${padStart(days)} : ${padStart(hours)} : ${padStart(minutes)} : ${padStart(seconds)}`

  const 벙에참여한벙주인가 = isParticipated && isOwner
  const 벙에참여한멤버인가 = isParticipated && !isOwner
  const 벙에참여한유저인가 = isParticipated
  const 벙완료시각이지났는가 = new Date() >= convertStringTimeToDate(details.startDateTime)

  const { mutate: completeBung } = useMutation(_completeBung)
  const handleBungComplete = () => {
    // WARNING for test
    router.replace('/')
    openModal({
      contents: (
        <BungCompleteModal
          imageUrl='/temp/img_thumbnail_1.png'
          title={details.name}
          location={details.location}
          memberList={details.memberList}
        />
      ),
    })

    // completeBung(
    //   { bungId: details.bungId },
    //   {
    //     onSuccess: (data) => {
    //       router.refresh()
    //       router.replace('/')

    //       openModal({
    //         contents: (
    //           <BungCompleteModal
    //             imageUrl='/temp/img_thumbnail_1.png'
    //             title={details.name}
    //             location={details.location}
    //             memberList={details.memberList}
    //           />
    //         ),
    //       })
    //     },
    //   },
    // )
  }

  const { mutate: joinBung } = useMutation(_joinBung)
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

  return (
    <section className='w-full h-full relative'>
      <header className='absolute w-full h-60 px-16 flex justify-between items-center' onClick={handleScrollToTop}>
        <Link href='/' onClick={(e) => e.stopPropagation()}>
          <BackIcon size={24} color='white' />
        </Link>
        <div className='flex gap-12 items-center'>
          {벙에참여한멤버인가 && <button className='text-white text-14'>참여 취소</button>}
          {벙에참여한벙주인가 && (
            <>
              {/** 벙 수정 */}
              <button onClick={() => openModal({ contents: <ModifyBungModal details={details} /> })}>
                <PencilIcon />
              </button>
              {/** 벙주 넘기기 */}
              <button onClick={() => setPageCategory('벙주 넘기기')}>
                <EscapeIcon />
              </button>
              {/** 벙 삭제 */}
              <button onClick={() => openModal({ contents: <DeleteBungModal bungId={details.bungId} /> })}>
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      </header>
      <div className='w-full h-200 bg-[url("/temp/img_thumbnail_1.png")] bg-cover cursor-pointer' />

      <motion.section
        style={{ y: translateY }}
        className='relative w-full h-full bg-gray-lighten bg-cover rounded-[8px_8px_0_0]'>
        {벙에참여한유저인가 && (
          <div
            className={`absolute -top-32 -z-[1] w-full h-40 px-16 flex justify-between bg-[#F06595] bg-opacity-60 rounded-[8px_8px_0_0]`}>
            <span className='relative italic text-14 font-bold text-white top-6'>{formattedTime}</span>
            <span className='relative text-14 text-white top-6'>시작까지 남은 시간</span>
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
              <PlaceIcon color={colors.black.default} />
              <span className='text-sm text-black-default'>{details.location}</span>
            </div>

            {/* 벙 시작 날짜 및 시간 */}
            <div className='flex gap-8 items-center mb-8'>
              <CalendarIcon color={colors.black.default} />
              <span className='text-sm text-black-default'>
                {format(convertStringTimeToDate(details.startDateTime), 'M월 d일 (E) a h:mm', { locale: ko })}
              </span>
            </div>

            {/* 벙 거리 및 페이스 */}
            <div className='flex gap-8 items-center mb-8'>
              <RunnerIcon color={colors.black.default} />
              <span className='text-sm text-black-default'>{`${details.distance} km ${details.pace}`}</span>
            </div>

            {/* 벙 참여 인원 및 남은 자리 */}
            <div className='flex gap-8 items-center mb-24'>
              <PersonIcon color={colors.black.default} />
              <div className='flex gap-4 items-center'>
                <span className='text-sm text-black-default'>{`${참여인원수} / ${details.memberNumber}`}</span>
                <span className='px-4 py-2 bg-pink-transparent rounded-4 text-12 font-bold text-pink-default'>{`${details.memberNumber - 참여인원수}자리 남았어요`}</span>
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
                    onClick={() => {
                      openModal({
                        contents: <CertifyParticipationModal destination={details.location} />,
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
                  <ArrowRight size={16} color={colors.black.darken} />
                </button>
                {벙에참여한벙주인가 && (
                  <>
                    <button
                      className='w-full h-56 rounded-8 bg-black-darken text-base font-bold text-white mt-16 disabled:bg-gray-default disabled:text-white'
                      disabled={벙완료시각이지났는가 === false}
                      onClick={handleBungComplete}>
                      벙 완료
                    </button>
                    {벙완료시각이지났는가 === false && (
                      <p className='text-12 font-semibold text-gray-darken mt-4 text-center'>
                        {format(convertStringTimeToDate(details.endDateTime), 'M/d a h:mm', { locale: ko })} 이후에
                        버튼이 활성화됩니다
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
            <PlaceIcon color={colors.black.default} />
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

function PencilIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.3333 5.66667L18.3333 9.66667L7 21H3V17L14.3333 5.66667ZM15.6667 9.66667L14.3333 8.33333L4.88562 17.781V19.1144H6.21895L15.6667 9.66667Z'
        fill='white'
      />
      <path d='M19.6667 8.33333L15.6667 4.33333L17 3L21 7L19.6667 8.33333Z' fill='white' />
    </svg>
  )
}

function EscapeIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        className='fill-white'
        d='M12.8484 8.04449C12.3456 7.50816 12.3456 6.63859 12.8484 6.10225C13.3513 5.56592 14.1667 5.56592 14.6696 6.10225C15.1725 6.63859 15.1725 7.50816 14.6696 8.04449C14.1667 8.58083 13.3513 8.58083 12.8484 8.04449Z'
      />
      <path
        className='fill-white'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5 3H19V21H5V3ZM6.75 4.8H17.25V19.2H6.75V15.5195L8.7508 13.3857L10.1165 14.8422L8.52296 16.5416C8.14578 16.9439 8.14578 17.5961 8.52296 17.9983C8.90013 18.4006 9.51165 18.4006 9.88882 17.9983L12.1653 15.5705C12.5424 15.1683 12.5424 14.5161 12.1653 14.1138L10.1167 11.929L11.3144 10.6517L12.049 12.0088C12.0878 12.0803 12.1333 12.1451 12.1844 12.2026C12.3459 12.5307 12.6685 12.7545 13.0401 12.7545H14.9717C15.5051 12.7545 15.9375 12.2934 15.9375 11.7245C15.9375 11.1556 15.5051 10.6945 14.9717 10.6945H13.568L12.3877 8.51432C12.3242 8.39701 12.2424 8.29807 12.1482 8.21924C12.0353 8.10483 11.8947 8.01799 11.7336 7.97197L8.62393 7.08333C8.40355 7.02035 8.18053 7.04398 7.98666 7.13464C7.86721 7.18489 7.75526 7.26152 7.65867 7.36453L6.75 8.33362V4.8ZM6.75 10.5512V12.6062L8.05109 11.2186C8.05653 11.2125 8.06206 11.2065 8.06767 11.2005C8.07328 11.1945 8.07894 11.1886 8.08465 11.1828L9.65302 9.51014L8.64789 9.22291L7.65867 10.2779C7.41225 10.5407 7.06578 10.6318 6.75 10.5512Z'
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className='fill-white' width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path d='M14.5714 3V3.9H18V5.7H6V3.9H9.42857V3H14.5714Z' />
      <path d='M9.42857 17.4H11.1429V10.2H9.42857V17.4Z' />
      <path d='M14.5714 17.4H12.8571V10.2H14.5714V17.4Z' />
      <path fillRule='evenodd' clipRule='evenodd' d='M6 21V6.6H18V21H6ZM16.2857 19.2H7.71429V8.4H16.2857V19.2Z' />
    </svg>
  )
}
