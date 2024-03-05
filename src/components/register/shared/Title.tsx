import { ReactNode } from 'react'

export default function Title({ children }: { children: ReactNode }) {
  return <h1 className='text-white text-4xl font-bold text-center'>{children}</h1>
}
