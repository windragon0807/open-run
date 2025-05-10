import { useCallback, useState } from 'react'
import { imageList } from '@store/image'

export function useThumbnailImage(initialImageUrl?: string | null) {
  const [imageIndex, setImageIndex] = useState(Number(initialImageUrl?.match(/\d+/)?.[0] || 1))

  const nextImage = useCallback(({ onChange }: { onChange?: (imageUrl: string) => void }) => {
    setImageIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % 13
      onChange?.(imageList[nextIndex - 1])
      return nextIndex
    })
  }, [])

  return { imageIndex, currentImageUrl: imageList[imageIndex - 1], nextImage }
}
