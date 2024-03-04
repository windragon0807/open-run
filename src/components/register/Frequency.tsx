import Spacing from '@shared/Spacing'
import Title from './Title'
import SubTitle from './SubTitle'
import Emoji from './Emoji'
import Slider from './Slider'

type Props = {
  frequency?: number
  setFrequency: (frequency: number) => void
}

export default function Frequency({ frequency = 0, setFrequency }: Props) {
  return (
    <section className='flex flex-col items-center'>
      <Emoji>🎯</Emoji>
      <Spacing size={20} />
      <Title>일주일에 몇 번 뛰나요?</Title>
      <Spacing size={10} />
      <SubTitle>당신의 목표를 알려주세요!</SubTitle>

      <Spacing size={20} />

      <span className='text-white text-2xl font-bold'>{frequency}일</span>
      <Spacing size={20} />
      <Slider min={0} max={7} value={frequency} onChange={(_, v) => setFrequency(v as number)} />
      <Spacing size={20} />
      <div className='w-320 text-sm text-white flex justify-between'>
        <span>0일</span>
        <span>7일</span>
      </div>
    </section>
  )
}
