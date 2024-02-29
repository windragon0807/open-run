import BackIcon from './icons/BackIcon'

type Props = {
  onIconClick?: () => void
}

export default function Header({ onIconClick }: Props) {
  return (
    <header className="fixed top-0 w-full max-w-tablet p-20 flex items-center">
      <button onClick={onIconClick}>
        <BackIcon />
      </button>
    </header>
  )
}
