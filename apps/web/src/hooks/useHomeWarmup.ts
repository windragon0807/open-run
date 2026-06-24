import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import {
  getOwnedNftAvatarItemsQueryOptions,
  getWearingNftAvatarQueryOptions,
} from '@apis/v1/nft/avatar-items/query'
import { imageList } from '@store/image'
import { getHomeAvatarWarmupImageUrls } from '@utils/avatarWarmup'

const AVATAR_PAGE_PATH = '/avatar'
const HOME_WARMUP_IDLE_TIMEOUT_MS = 1_800
const HOME_CREATE_BUNG_IMAGE_WARMUP_LIMIT = imageList.length

type RequestIdleCallback = (callback: () => void, options?: { timeout: number }) => number
type CancelIdleCallback = (handle: number) => void
type WindowWithIdleCallback = Window & {
  requestIdleCallback?: RequestIdleCallback
  cancelIdleCallback?: CancelIdleCallback
}

type HomeWarmupImageUrls = {
  avatarPreviewImageUrls: string[]
  avatarWearableImageUrls: string[]
  createBungImageUrls: string[]
}

export function useHomeWarmup({ enabled = true }: { enabled?: boolean } = {}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [avatarPreviewImageUrls, setAvatarPreviewImageUrls] = useState<string[]>([])
  const [avatarWearableImageUrls, setAvatarWearableImageUrls] = useState<string[]>([])
  const [createBungImageUrls, setCreateBungImageUrls] = useState<string[]>([])

  const warmupAvatarPage = useCallback(() => {
    router.prefetch(AVATAR_PAGE_PATH)

    void Promise.allSettled([
      queryClient.fetchQuery(getOwnedNftAvatarItemsQueryOptions()),
      queryClient.fetchQuery(getWearingNftAvatarQueryOptions()),
    ]).then(([ownedItemsResult, wearingAvatarResult]) => {
      const avatarList = ownedItemsResult.status === 'fulfilled' ? ownedItemsResult.value.data ?? [] : []
      const wearingAvatar = wearingAvatarResult.status === 'fulfilled' ? wearingAvatarResult.value.data : null
      const nextWarmupImageUrls = getHomeAvatarWarmupImageUrls(avatarList, wearingAvatar)

      setAvatarPreviewImageUrls((currentImageUrls) =>
        areSameImageUrls(currentImageUrls, nextWarmupImageUrls.previewImageUrls)
          ? currentImageUrls
          : nextWarmupImageUrls.previewImageUrls,
      )
      setAvatarWearableImageUrls((currentImageUrls) =>
        areSameImageUrls(currentImageUrls, nextWarmupImageUrls.wearableImageUrls)
          ? currentImageUrls
          : nextWarmupImageUrls.wearableImageUrls,
      )
    })
  }, [queryClient, router])

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

    return scheduleHomeWarmup(() => {
      warmupAvatarPage()
      warmupCreateBungImages()
    })
  }, [enabled, warmupAvatarPage, warmupCreateBungImages])

  const warmupImageUrls: HomeWarmupImageUrls = {
    avatarPreviewImageUrls,
    avatarWearableImageUrls,
    createBungImageUrls,
  }

  return {
    warmupAvatarPage,
    warmupCreateBungImages,
    warmupImageUrls,
  }
}

function scheduleHomeWarmup(callback: () => void): () => void {
  const currentWindow = window as WindowWithIdleCallback

  if (typeof currentWindow.requestIdleCallback === 'function') {
    const idleCallbackId = currentWindow.requestIdleCallback(callback, {
      timeout: HOME_WARMUP_IDLE_TIMEOUT_MS,
    })

    return () => currentWindow.cancelIdleCallback?.(idleCallbackId)
  }

  const timeoutId = window.setTimeout(callback, HOME_WARMUP_IDLE_TIMEOUT_MS)
  return () => window.clearTimeout(timeoutId)
}

function areSameImageUrls(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false

  return left.every((imageUrl, index) => imageUrl === right[index])
}
