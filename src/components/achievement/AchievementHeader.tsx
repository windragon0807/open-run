import { HeaderBackButton } from './HeaderBackButton'

/**
 * 도전과제 헤더 컴포넌트
 */
export default function AchievementHeader() {
  return (
    <header className='relative z-20 flex h-60 w-full items-center justify-center bg-[#F8F9FA] px-5'>
      <HeaderBackButton />
      <h1 className='text-16 font-bold text-black-default'>도전 과제</h1>
    </header>
  )
} 