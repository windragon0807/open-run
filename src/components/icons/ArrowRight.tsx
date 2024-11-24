export default function ArrowRight({
  size = 24,
  color = 'black',
  className,
}: {
  size?: number
  color?: string
  className?: string
}) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' className={className}>
      <path d='M12.6 12L8 7.4L9.4 6L15.4 12L9.4 18L8 16.6L12.6 12Z' fill={color} />
    </svg>
  )
}
