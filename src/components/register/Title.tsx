import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function Title({ children }: Props) {
  return <h1 className='text-white text-4xl font-bold text-center'>{children}</h1>
}
