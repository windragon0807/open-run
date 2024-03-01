import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function SubTitle({ children }: Props) {
  return <p className='text-white text-xl font-light text-center'>{children}</p>
}
