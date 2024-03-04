import { Slider as BaseSlider, SliderThumbSlotProps, SliderProps } from '@mui/base/Slider'
import { forwardRef } from 'react'

const Thumb = forwardRef(function Thumb(props: SliderThumbSlotProps, ref: React.ForwardedRef<HTMLSpanElement>) {
  const { ownerState, className = '', ...other } = props
  return (
    <span
      className={`${className} w-30 h-30 -mt-10 -ml-14 flex items-center justify-center bg-white rounded-full shadow absolute`}
      ref={ref}
      {...other}></span>
  )
})

const Slider = forwardRef(function Slider(props: SliderProps, ref: React.ForwardedRef<HTMLSpanElement>) {
  return (
    <BaseSlider
      {...props}
      ref={ref}
      slots={{
        thumb: Thumb,
      }}
      slotProps={{
        root: { className: 'w-300 relative inline-block h-2 cursor-ew-resize' },
        rail: {
          className: 'bg-gray h-10 w-full rounded-full block absolute',
        },
        track: {
          className: 'bg-secondary h-10 absolute rounded-full',
        },
      }}
    />
  )
})

export default Slider
