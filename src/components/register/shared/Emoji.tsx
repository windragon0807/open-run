import { ReactNode } from 'react'

export default function Emoji({ children }: { children: ReactNode }) {
  return <span className='text-[100px]'>{children}</span>
}
