import Link from 'next/link'
import { colors } from '@styles/colors'

/**
 * 헤더 뒤로가기 버튼 컴포넌트
 */
export function HeaderBackButton() {
  return (
    <Link href='/' className='absolute left-16'>
      <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
        <path d='M11.4 12L16 7.4L14.6 6L8.6 12L14.6 18L16 16.6L11.4 12Z' fill={colors.black.darken} />
      </svg>
    </Link>
  )
} 