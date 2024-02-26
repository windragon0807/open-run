import Link from 'next/link'

import BackIcon from './icons/BackIcon'

export default function Header() {
  return (
    <header className="w-full p-20 flex items-center">
      <Link href="signin">
        <BackIcon />
      </Link>
    </header>
  )
}
