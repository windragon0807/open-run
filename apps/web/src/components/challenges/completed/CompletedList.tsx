import type { ChallengeType, CompletedChallengeWithNft } from '@apis/v1/challenges/type'
import type { CategoryType } from '@type/challenge'
import { parseApiDateTime } from '@utils/api'
import { formatDate } from '@utils/time'
import CategoryReward from './CategoryReward'

export default function CompletedList({ challenges }: { challenges: CompletedChallengeWithNft[] }) {
  return (
    <section className='flex h-[calc(100%-102px)] w-full flex-col gap-8 overflow-y-auto px-16 pb-120'>
      {challenges.length === 0 ? (
        <p className='mt-80 text-center text-14 leading-20 text-gray-darken'>아직 완료한 도전과제가 없어요</p>
      ) : (
        challenges.map((challenge) => <CompletedItem key={challenge.userChallengeId} challenge={challenge} />)
      )}
    </section>
  )
}

function CompletedItem({ challenge }: { challenge: CompletedChallengeWithNft }) {
  const nft = challenge.nft
  const completedDate = parseApiDateTime(nft?.mintedAt ?? challenge.completedDate)
  const completedAt =
    completedDate == null ? '시간 정보 없음' : formatDate({ date: completedDate, formatStr: 'yyyy.M.d HH:mm' })

  return (
    <article className='grid w-full grid-cols-[60px_1fr_70px] place-items-center gap-8 rounded-8 bg-white px-16 py-10'>
      <CategoryReward
        category={toCategory(challenge.challengeType)}
        imageSrc={nft?.image || undefined}
        imageAlt={nft?.name ?? challenge.challengeName}
      />
      <div className='flex w-full min-w-0 flex-col justify-start'>
        <span className='line-clamp-1 text-14 font-bold'>{challenge.challengeName}</span>
        <span className='mt-2 line-clamp-1 text-10 font-medium text-gray-darken'>
          {nft?.name ?? 'NFT 보상'} · {completedAt}
        </span>
      </div>
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray text-14 font-bold text-white'>
        보상 완료
      </div>
    </article>
  )
}

function toCategory(challengeType: ChallengeType): CategoryType {
  if (challengeType === 'normal') return 'general'
  if (challengeType === 'repetitive') return 'repetitive'
  return 'event'
}
