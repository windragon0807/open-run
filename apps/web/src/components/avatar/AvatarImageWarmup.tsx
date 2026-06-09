import Image from 'next/image'

type AvatarImageWarmupProps = {
  imageUrls: string[]
  width: number
  height: number
  sizes?: string
  limit?: number
}

export default function AvatarImageWarmup({
  imageUrls,
  width,
  height,
  sizes = `${width}px`,
  limit = Infinity,
}: AvatarImageWarmupProps) {
  const warmupImageUrls = imageUrls.slice(0, limit)

  if (warmupImageUrls.length === 0) return null

  return (
    <div
      aria-hidden='true'
      style={{
        position: 'fixed',
        left: -10_000,
        top: 0,
        width,
        height,
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
      }}>
      {warmupImageUrls.map((imageUrl) => (
        <Image
          key={imageUrl}
          src={imageUrl}
          alt=''
          width={width}
          height={height}
          sizes={sizes}
          loading='eager'
          fetchPriority='low'
        />
      ))}
    </div>
  )
}
