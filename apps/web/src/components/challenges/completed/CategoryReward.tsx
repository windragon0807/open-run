import clsx from 'clsx'
import Image from 'next/image'
import type { CategoryType } from '@type/challenge'

export default function CategoryReward({
  category,
  imageSrc = '/temp/nft_achievement_reward.png',
  imageAlt = 'category reward',
}: {
  category: CategoryType
  imageSrc?: string
  imageAlt?: string
}) {
  return (
    <article className='relative flex size-60 items-center justify-center'>
      <Category category={category} />
      <div className='flex size-48 items-center justify-center rounded-full bg-gradient-achievement-gray'>
        <Image src={imageSrc} alt={imageAlt} width={32} height={32} className='object-contain' />
      </div>
    </article>
  )
}

function Category({ category }: { category: CategoryType }) {
  return (
    <span
      className={clsx(
        'absolute left-0 top-0 rounded-25 px-4 py-2 text-10 font-medium text-white',
        category === 'event' ? 'bg-primary' : 'bg-black',
      )}>
      {(() => {
        switch (category) {
          case 'general':
            return '일반'
          case 'repetitive':
            return '반복'
          case 'event':
            return '이벤트'
        }
      })()}
    </span>
  )
}
