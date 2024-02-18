import Link from 'next/link'

import BackIcon from './icons/BackIcon'

export default function Header() {
  return (
    <header className="h-[60px] w-full px-[20px] flex items-center">
      <Link href="signin">
        <BackIcon />
      </Link>
    </header>
  )
}
