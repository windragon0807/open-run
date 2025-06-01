import clsx from 'clsx'
import { useAppStore } from '@store/app'
import FaceNumberPicker from './FaceNumberPicker'

export default function Pace({ pace, setPace }: { pace: string; setPace: (pace: string) => void }) {
  const { isApp } = useAppStore()
  return (
    <div className={clsx('flex h-full w-full flex-col items-center', isApp ? 'pt-174' : 'pt-124')}>
      <div className='mt-10 text-center text-28'>평균 페이스를 알려주세요</div>
      <div className='mb-50 text-center text-28 font-bold text-primary'>나의 평균 페이스는</div>
      <FaceNumberPicker
        defaultValue={pace}
        onChange={setPace}
        minMinutes={0}
        maxMinutes={20}
        minSeconds={0}
        maxSeconds={59}
      />
    </div>
  )
}
