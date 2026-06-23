import { useCallback, useEffect, useState } from 'react'
import { imageList } from '@store/image'
import { useAvatarPageWarmup } from './useAvatarPageWarmup'

const HOME_CREATE_BUNG_IMAGE_WARMUP_DELAY_MS = 2_400
const HOME_CREATE_BUNG_IMAGE_WARMUP_LIMIT = imageList.length

type HomeWarmupImageUrls = {
  avatarPreviewImageUrls: string[]
  avatarWearableImageUrls: string[]
  createBungImageUrls: string[]
}

export function useHomeWarmup({ enabled = true }: { enabled?: boolean } = {}) {
  const { warmupAvatarPage, warmupImageUrls: avatarWarmupImageUrls } = useAvatarPageWarmup({ enabled })
  const [createBungImageUrls, setCreateBungImageUrls] = useState<string[]>([])

  const warmupCreateBungImages = useCallback(() => {
    const nextImageUrls = imageList.slice(0, HOME_CREATE_BUNG_IMAGE_WARMUP_LIMIT)

    setCreateBungImageUrls((currentImageUrls) => {
      if (areSameImageUrls(currentImageUrls, nextImageUrls)) {
        return currentImageUrls
      }

      return nextImageUrls
    })
  }, [])

  useEffect(() => {
    if (!enabled) return

    const timeoutId = window.setTimeout(warmupCreateBungImages, HOME_CREATE_BUNG_IMAGE_WARMUP_DELAY_MS)
    return () => window.clearTimeout(timeoutId)
  }, [enabled, warmupCreateBungImages])

  const warmupImageUrls: HomeWarmupImageUrls = {
    avatarPreviewImageUrls: avatarWarmupImageUrls.previewImageUrls,
    avatarWearableImageUrls: avatarWarmupImageUrls.wearableImageUrls,
    createBungImageUrls,
  }

  return {
    warmupAvatarPage,
    warmupCreateBungImages,
    warmupImageUrls,
  }
}

function areSameImageUrls(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false

  return left.every((imageUrl, index) => imageUrl === right[index])
}
