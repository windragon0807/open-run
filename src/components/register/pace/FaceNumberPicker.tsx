import { padStart } from '@utils/string'
import NumberDial from './NumberDial'
import { useNumberDial } from './hooks/useNumberDial'

interface FaceNumberPickerProps {
  defaultValue: string
  onChange: (value: string) => void
  minMinutes?: number
  maxMinutes?: number
  minSeconds?: number
  maxSeconds?: number
}

export default function FaceNumberPicker({
  defaultValue,
  onChange,
  minMinutes = 0,
  maxMinutes = 59,
  minSeconds = 0,
  maxSeconds = 59,
}: FaceNumberPickerProps) {
  const {
    value: minutes,
    handleTouchStart: handleMinutesTouchStart,
    handleTouchMove: handleMinutesTouchMove,
    handleTouchEnd: handleMinutesTouchEnd,
    handleMouseDown: handleMinutesMouseDown,
    handleMouseMove: handleMinutesMouseMove,
    handleMouseUp: handleMinutesMouseUp,
    handleWheel: handleMinutesWheel,
  } = useNumberDial({
    initialValue: parseInt(defaultValue.split("'")[0]),
    min: minMinutes,
    max: maxMinutes,
    onChange: (newMinutes) => onChange(`${newMinutes}'${padStart(seconds)}`),
  })

  const {
    value: seconds,
    handleTouchStart: handleSecondsTouchStart,
    handleTouchMove: handleSecondsTouchMove,
    handleTouchEnd: handleSecondsTouchEnd,
    handleMouseDown: handleSecondsMouseDown,
    handleMouseMove: handleSecondsMouseMove,
    handleMouseUp: handleSecondsMouseUp,
    handleWheel: handleSecondsWheel,
  } = useNumberDial({
    initialValue: parseInt(defaultValue.split("'")[1]),
    min: minSeconds,
    max: maxSeconds,
    onChange: (newSeconds) => onChange(`${padStart(minutes)}'${padStart(newSeconds)}`),
  })

  return (
    <div className='flex items-center justify-center'>
      {' '}
      {/* 구분자 간격 조정 */}
      <div className='relative w-86 h-[320px] overflow-hidden touch-none'>
        <NumberDial
          value={minutes}
          min={minMinutes}
          max={maxMinutes}
          onChange={(newMinutes) => onChange(`${newMinutes}'${padStart(seconds)}`)}
          handleTouchStart={handleMinutesTouchStart}
          handleTouchMove={handleMinutesTouchMove}
          handleTouchEnd={handleMinutesTouchEnd}
          handleMouseDown={handleMinutesMouseDown}
          handleMouseMove={handleMinutesMouseMove}
          handleMouseUp={handleMinutesMouseUp}
          handleWheel={handleMinutesWheel}
          digits={2}
        />
      </div>
      <div className='text-[#4A5CEF] text-center font-pretendard text-[40px] font-bold leading-[56px] tracking-tight italic touch-none mb-18 ml-[-2px] mr-4'>
        {`'`}
      </div>
      <div className='relative w-86 h-[320px] overflow-hidden touch-none'>
        <NumberDial
          value={seconds}
          min={minSeconds}
          max={maxSeconds}
          onChange={(newSeconds) => onChange(`${padStart(minutes)}'${padStart(newSeconds)}`)}
          handleTouchStart={handleSecondsTouchStart}
          handleTouchMove={handleSecondsTouchMove}
          handleTouchEnd={handleSecondsTouchEnd}
          handleMouseDown={handleSecondsMouseDown}
          handleMouseMove={handleSecondsMouseMove}
          handleMouseUp={handleSecondsMouseUp}
          handleWheel={handleSecondsWheel}
          digits={2}
        />
      </div>
      <div className='text-[#4A5CEF] text-center font-pretendard text-[40px] font-bold leading-[56px] tracking-tight italic touch-none mb-18 ml-[-4px]'>
        {`"`}
      </div>
    </div>
  )
}
