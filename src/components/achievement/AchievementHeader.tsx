import { HeaderBackButton } from './HeaderBackButton'

/**
 * 도전과제 헤더 컴포넌트 Props
 */
interface AchievementHeaderProps {
  /** 뒤로 가기 버튼 클릭 이벤트 핸들러 */
  onClose: () => void
}

/**
 * 도전과제 헤더 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export default function AchievementHeader({ onClose }: AchievementHeaderProps) {
  return (
    <header className='relative z-20 flex h-60 w-full items-center justify-center bg-[#F8F9FA] px-5'>
      <HeaderBackButton onClose={onClose} />
      <h1 className='text-16 font-bold text-black-default'>도전 과제</h1>
    </header>
  )
} 