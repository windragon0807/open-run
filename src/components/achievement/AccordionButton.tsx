/**
 * 아코디언 버튼 컴포넌트 Props
 */
interface AccordionButtonProps {
  /** 아코디언 상태 (열림/닫힘) */
  isOpen: boolean
  /** 클릭 핸들러 */
  onClick: () => void
  /** 추가 클래스명 */
  className?: string
}

/**
 * 아코디언 버튼 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 * @returns 아코디언 버튼 컴포넌트
 */
export function AccordionButton({ isOpen, onClick, className = '' }: AccordionButtonProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`w-[7.4px] h-[12px] text-[#89939D] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${className}`}
      aria-label={isOpen ? '접기' : '펼치기'}
    >
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
} 