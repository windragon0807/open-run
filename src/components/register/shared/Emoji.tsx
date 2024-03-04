import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function Emoji({ children }: Props) {
  return <span className='text-[100px]'>{children}</span>
}
