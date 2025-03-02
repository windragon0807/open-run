import { useCallback } from 'react'
import { colors } from '@styles/colors'

/**
 * 헤더 뒤로가기 버튼 Props
 */
interface HeaderBackButtonProps {
  onClose: () => void
}

/**
 * 헤더 뒤로가기 버튼 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function HeaderBackButton({ onClose }: HeaderBackButtonProps) {
  const handleClose = useCallback(() => {
    // 직접 함수 호출
    onClose();
    
    // 직렬화 가능한 방식으로 이벤트 발생 (대안)
    const event = new CustomEvent('achievementClose');
    window.dispatchEvent(event);
  }, [onClose]);

  return (
    <button onClick={handleClose} className='absolute left-16'>
      <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
        <path d='M11.4 12L16 7.4L14.6 6L8.6 12L14.6 18L16 16.6L11.4 12Z' fill={colors.black.darken} />
      </svg>
    </button>
  )
} 