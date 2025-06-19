import { useAppRouter } from '@hooks/useAppRouter'
import { colors } from '@styles/colors'

export default function Header({ onSaveButtonClick }: { onSaveButtonClick: () => void }) {
  const appRouter = useAppRouter()
  return (
    <header className='relative z-20 flex h-60 w-full items-center justify-center bg-white px-5'>
      <button className='absolute left-16' onClick={() => appRouter.push('/')}>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <path d='M11.4 12L16 7.4L14.6 6L8.6 12L14.6 18L16 16.6L11.4 12Z' fill={colors.black.darken} />
        </svg>
      </button>
      <h1 className='text-black text-16 font-bold'>아바타 변경</h1>
      <button className='absolute right-16' onClick={onSaveButtonClick}>
        <span className='text-black text-14'>저장</span>
      </button>
    </header>
  )
}
