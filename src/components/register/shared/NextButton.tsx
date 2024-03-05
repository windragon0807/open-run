import { ReactNode } from 'react'

// TODO 아래에서 위로 올라오는 애니메이션 추가
export default function NextButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button className='w-223 h-59 bg-white text-primary text-xl font-bold rounded-30' onClick={onClick}>
      {children}
    </button>
  )
}
