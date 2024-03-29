import { ReactNode } from 'react'

export default function SubTitle({ children }: { children: ReactNode }) {
  return <p className='text-white text-xl font-light text-center'>{children}</p>
}
