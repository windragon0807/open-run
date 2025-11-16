import clsx from 'clsx'
import { useAppStore } from '@store/app'
import Recommendation from '@components/home/Recommendation'
import { MagnifierIcon } from '@icons/magnifier'
import { colors } from '@styles/colors'

export default function ExploreHome({ onSearchButtonClick }: { onSearchButtonClick: () => void }) {
  const { isApp } = useAppStore()
  return (
    <section className='h-full w-full bg-white'>
      <div className={clsx('px-16', isApp ? 'pt-72' : 'pt-32')}>
        <h1 className='mb-16 text-28 font-bold'>탐색</h1>
        <button
          className='mb-24 flex h-40 w-full items-center justify-between rounded-8 border border-gray px-16 active-press-duration active:scale-95 active:bg-gray/30'
          onClick={onSearchButtonClick}>
          <span className='text-14 text-gray-darken'>벙 검색</span>
          <MagnifierIcon size={16} color={colors.black.darken} />
        </button>
      </div>
      <div className='h-[calc(100%-148px)] w-full overflow-y-auto pb-60'>
        <Recommendation />
      </div>
    </section>
  )
}
