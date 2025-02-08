import BrokenXIcon from '@icons/BrokenXIcon'
import { colors } from '@styles/colors'

export default function HashTag({ label, onCloseButtonClick }: { label: string; onCloseButtonClick: () => void }) {
  return (
    <div className='flex w-fit items-center gap-8 px-8 py-4 bg-black-darken rounded-4'>
      <span className='text-white text-14'>{label}</span>
      <button onClick={onCloseButtonClick}>
        <BrokenXIcon size={16} color={colors.white} />
      </button>
    </div>
  )
}
