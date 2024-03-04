import { RegisterStep } from '@/models/register'
import BackIcon from './icons/BackIcon'

type Props = {
  step: RegisterStep
  onIconClick?: () => void
}

export default function Header({ step, onIconClick }: Props) {
  return (
    <header className='fixed top-0 w-full max-w-tablet p-20 flex items-center'>
      <button className='' onClick={onIconClick}>
        <BackIcon />
      </button>
      <div className='flex gap-40 absolute left-[50%] -translate-x-1/2'>
        {step !== 0 ? (
          <>
            <ProgressCircle status={step === 1 ? 'active' : 'completed'} />
            <ProgressCircle status={step === 2 ? 'active' : step >= 3 ? 'completed' : 'default'} />
            <ProgressCircle status={step === 3 ? 'active' : step === 4 ? 'completed' : 'default'} />
          </>
        ) : null}
      </div>
    </header>
  )
}

function ProgressCircle({ status = 'default' }: { status?: 'default' | 'active' | 'completed' }) {
  return (
    <div
      className={`w-25 h-25 rounded-[50%] transition-colors duration-700 ease-in-out
      ${status === 'default' ? 'bg-gray' : ''}
      ${status === 'active' ? 'bg-gray outline outline-[5px] outline-secondary' : ''}
      ${status === 'completed' ? 'bg-secondary' : ''}
    `}></div>
  )
}
