import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@styles/colors'

export default function Checkbox({
  text,
  checked,
  onChange,
}: {
  text?: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className='relative'>
      <input
        className='hidden'
        type='checkbox'
        id='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor='checkbox' className='flex items-center gap-8 cursor-pointer'>
        <div
          className={`flex items-center justify-center w-24 h-24 rounded-8 ${checked ? 'bg-pink' : 'border border-gray-default'}`}>
          <motion.svg
            initial={{ y: 0 }}
            animate={{ y: checked ? [10, 0] : 0 }}
            transition={{
              duration: 0.5,
              y: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
              },
            }}
            width={16}
            height={16}
            viewBox='0 0 16 16'
            fill={checked ? colors.white : colors.gray.default}>
            <rect x='5.88574' y='10.876' width='8' height='1.33333' transform='rotate(-45 5.88574 10.876)' />
            <rect x='4.27637' y='7.38184' width='4.66667' height='1.33333' transform='rotate(45 4.27637 7.38184)' />
          </motion.svg>
        </div>
        {text}
      </label>
    </div>
  )
}
