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
          // 전역 preflight(img { height: auto })가 고유 비율이 제각각인 NFT 이미지의 height를
          // 바꿔 next/image 경고를 낸다. 보이지 않는 프리로드라 비율 보존이 필요 없으니 크기를 고정한다.
          style={{ width, height }}
          loading='eager'
          fetchPriority='low'
        />
      ))}
    </div>
  )
}
