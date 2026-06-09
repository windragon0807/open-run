import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { getOwnedNftAvatarItemsQueryOptions } from '@apis/v1/nft/avatar-items/query'
import {
  getAvatarPreviewImageWarmupUrls,
  getAvatarWearableImageWarmupUrls,
} from '@utils/avatarImage'

const AVATAR_PAGE_PATH = '/avatar'
const HOME_AVATAR_WARMUP_DELAY_MS = 1_200
const HOME_AVATAR_PREVIEW_IMAGE_WARMUP_LIMIT = 12
const HOME_AVATAR_WEARABLE_IMAGE_WARMUP_LIMIT = 9

type HomeAvatarWarmupImageUrls = {
  previewImageUrls: string[]
  wearableImageUrls: string[]
}

export function useAvatarPageWarmup({ enabled = true }: { enabled?: boolean } = {}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [warmupImageUrls, setWarmupImageUrls] = useState<HomeAvatarWarmupImageUrls>({
    previewImageUrls: [],
    wearableImageUrls: [],
  })

  const warmupAvatarPage = useCallback(() => {
    router.prefetch(AVATAR_PAGE_PATH)

    void queryClient
      .fetchQuery(getOwnedNftAvatarItemsQueryOptions())
      .then((response) => {
        const avatarList = response.data ?? []
        const nextWarmupImageUrls = {
          previewImageUrls: getAvatarPreviewImageWarmupUrls(avatarList, {
            mainCategory: 'upperClothing',
            subCategory: null,
            limit: HOME_AVATAR_PREVIEW_IMAGE_WARMUP_LIMIT,
          }),
          wearableImageUrls: getAvatarWearableImageWarmupUrls(avatarList, {
            mainCategory: 'upperClothing',
            subCategory: null,
            limit: HOME_AVATAR_WEARABLE_IMAGE_WARMUP_LIMIT,
          }),
        }

        setWarmupImageUrls((currentWarmupImageUrls) => {
          if (areSameWarmupImageUrls(currentWarmupImageUrls, nextWarmupImageUrls)) {
            return currentWarmupImageUrls
          }

          return nextWarmupImageUrls
        })
      })
      .catch(() => undefined)
  }, [queryClient, router])

  useEffect(() => {
    if (!enabled) return

    const timeoutId = window.setTimeout(warmupAvatarPage, HOME_AVATAR_WARMUP_DELAY_MS)
    return () => window.clearTimeout(timeoutId)
  }, [enabled, warmupAvatarPage])

  return {
    warmupAvatarPage,
    warmupImageUrls,
  }
}

function areSameWarmupImageUrls(left: HomeAvatarWarmupImageUrls, right: HomeAvatarWarmupImageUrls): boolean {
  return (
    areSameImageUrls(left.previewImageUrls, right.previewImageUrls) &&
    areSameImageUrls(left.wearableImageUrls, right.wearableImageUrls)
  )
}

function areSameImageUrls(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false

  return left.every((imageUrl, index) => imageUrl === right[index])
}
