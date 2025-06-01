import clsx from 'clsx'
import { useAppStore } from '@store/app'
import { RegisterStep } from '@type/register'
import ArrowLeftIcon from '@icons/ArrowLeftIcon'
import { colors } from '@styles/colors'

export default function Header({
  step,
  onBackIconClick,
  onSkipTextClick,
}: {
  step: RegisterStep
  onBackIconClick: () => void
  onSkipTextClick: () => void
}) {
  const { isApp } = useAppStore()
  const 건너뛰기버튼이보이는단계인가 = step === 2 || step === 3

  return (
    <header className={clsx('absolute flex h-60 w-full items-center bg-gray-lighten px-16', isApp && 'top-50')}>
      <div className='flex w-full items-center justify-between'>
        <button onClick={onBackIconClick}>
          <ArrowLeftIcon size={40} color={colors.black.darkest} />
        </button>
        {건너뛰기버튼이보이는단계인가 ? (
          <button onClick={onSkipTextClick}>
            <span className='mr-8 text-14'>건너뛰기</span>
          </button>
        ) : null}
      </div>

      <section className='absolute bottom-0 left-16 right-16 h-3'>
        <div
          className='h-full w-full bg-primary'
          style={{
            transform: `scaleX(${step / 4})`,
            transformOrigin: 'left',
            transition: 'transform 0.3s',
          }}
        />
      </section>
    </header>
  )
}
