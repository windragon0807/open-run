import { RegisterStep } from '@models/register'
import BackIcon from '@components/icons/BackIcon'

export default function Header({
  step,
  onBackIconClick,
  onSkipTextClick,
}: {
  step: RegisterStep
  onBackIconClick: () => void
  onSkipTextClick: () => void
}) {
  const 건너뛰기버튼이보이는단계인가 = step === 2 || step === 3

  return (
    <header className='absolute w-full px-16 h-60 flex items-center bg-gray-lighten'>
      <div className='w-full flex justify-between items-center'>
        <button onClick={onBackIconClick}>
          <BackIcon color='#000000' />
        </button>
        {건너뛰기버튼이보이는단계인가 ? (
          <button onClick={onSkipTextClick}>
            <span className='text-sm mr-8'>건너뛰기</span>
          </button>
        ) : null}
      </div>

      <section className='absolute left-16 right-16 bottom-0 h-3'>
        <div
          className='bg-primary w-full h-full'
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
