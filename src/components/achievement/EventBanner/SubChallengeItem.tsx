'use client'

import { AchievementButton, AchievementButtonType } from '../buttons'
import { ProgressBar } from '../buttons'
import { SubChallengeItemProps } from './types'

/**
 * 서브 도전과제 아이템 컴포넌트
 */
export function SubChallengeItem({ challenge, onChallengeClick }: SubChallengeItemProps) {
  const isCompleted = challenge.status === '완료'
  const isPending = challenge.status === '진행중'

  /**
   * 버튼 타입 결정 함수
   */
  const getButtonType = (): AchievementButtonType => {
    if (isCompleted) return 'completed'
    if (isPending) return 'progress'
    return 'reward'
  }

  /**
   * 진행도 텍스트 생성
   */
  const getProgressText = () => {
    if (isCompleted) return '완료'
    return `${challenge.progress.current}/${challenge.progress.total}`
  }

  return (
    <div className='mb-3 flex w-full justify-center'>
      <div className='relative flex h-[120px] w-full cursor-pointer rounded-[10px] bg-white shadow-sm transition-all duration-300'>
        {/* 서브 도전과제 이미지 */}
        <div
          className='my-[30px] ml-[16px] h-[60px] w-[60px] rounded-[10px] bg-[#DEE2E6] transition-transform duration-300'
          style={{
            backgroundSize: 'cover',
            backgroundImage: challenge.imageUrl ? `url(${challenge.imageUrl})` : 'none',
            backgroundPosition: 'center',
          }}></div>

        {/* 서브 도전과제 콘텐츠 영역 */}
        <div className='relative ml-[8px] flex-1'>
          {/* 제목과 설명 */}
          <div className='mt-[22px]'>
            {/* 이벤트 주제 */}
            <h4
              className='max-w-[180px] truncate text-[14px] font-bold leading-[20px] tracking-[-0.02em] text-[#666666]'
              style={{ fontFamily: 'Pretendard', fontWeight: 700 }}>
              {challenge.theme}
            </h4>

            {/* 이벤트 제목 */}
            <h5
              className='max-w-[180px] truncate text-[14px] font-bold leading-[20px] tracking-[-0.02em] text-[#222222]'
              style={{ fontFamily: 'Pretendard', fontWeight: 700 }}>
              {challenge.title}
            </h5>

            <p className='max-w-[180px] truncate text-[12px] font-normal leading-[16px] tracking-[-0.02em] text-[#666666]'>
              {challenge.description}
            </p>
          </div>

          {/* 하단 정보 영역 */}
          <div className='absolute bottom-[16px] left-0 right-[16px] flex items-center justify-between'>
            <div className='mr-[11px] flex-1'>
              {/* 진행도 바 */}
              <ProgressBar current={challenge.progress.current} total={challenge.progress.total} width='100%' />
            </div>

            {/* 진행도 텍스트 또는 버튼 */}
            <div className='flex items-center'>
              {isCompleted ? (
                <AchievementButton
                  type={getButtonType()}
                  status={challenge.status}
                  current={challenge.progress.current}
                  total={challenge.progress.total}
                  onClick={() => onChallengeClick?.(challenge)}
                />
              ) : (
                <div className='rounded-[6px] bg-[#F8F9FA] px-[12px] py-[6px] text-[12px] font-medium text-[#666666]'>
                  {getProgressText()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
