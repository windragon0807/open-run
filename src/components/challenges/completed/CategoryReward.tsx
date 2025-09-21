import clsx from 'clsx'
import Image from 'next/image'

type Category = 'normal' | 'repeat' | 'event'

export default function CategoryReward({ category }: { category: Category }) {
  return (
    <article className='relative flex size-60 items-center justify-center'>
      <Category category={category} />
      <div className='flex size-48 items-center justify-center rounded-full bg-gradient-achievement-gray'>
        <Image src='/temp/nft_achievement_reward.png' alt='category reward' width={32} height={32} />
      </div>
    </article>
  )
}

function Category({ category }: { category: Category }) {
  return (
    <span
      className={clsx(
        'absolute left-0 top-0 rounded-25 px-4 py-2 text-10 font-medium text-white',
        category === 'event' ? 'bg-primary' : 'bg-black',
      )}>
      {(() => {
        switch (category) {
          case 'normal':
            return '일반'
          case 'repeat':
            return '반복'
          case 'event':
            return '이벤트'
        }
      })()}
    </span>
  )
}
