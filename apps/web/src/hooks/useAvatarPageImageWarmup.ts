import { useCallback, useMemo, useState } from 'react'
import { Avatar, SelectedCategory } from '@type/avatar'
import {
  getAvatarPageWarmupImageUrls,
  mergeImageUrls,
} from '@utils/avatarWarmup'
import { getAvatarWearableImageUrls } from '@utils/avatarImage'

type AvatarPageImageWarmup = {
  previewImageUrls: string[]
  wearableImageUrls: string[]
  warmupAvatarItem: (avatar: Avatar) => void
}

export function useAvatarPageImageWarmup(
  avatarList: Avatar[],
  selectedCategory: SelectedCategory,
): AvatarPageImageWarmup {
  const [intentWearableImageUrls, setIntentWearableImageUrls] = useState<string[]>([])

  const categoryWarmupImageUrls = useMemo(
    () => getAvatarPageWarmupImageUrls(avatarList, selectedCategory),
    [avatarList, selectedCategory],
  )

  const warmupAvatarItem = useCallback((avatar: Avatar) => {
    const nextImageUrls = getAvatarWearableImageUrls(avatar)

    setIntentWearableImageUrls((currentImageUrls) =>
      areSameImageUrls(currentImageUrls, nextImageUrls) ? currentImageUrls : nextImageUrls,
    )
  }, [])

  return {
    previewImageUrls: categoryWarmupImageUrls.previewImageUrls,
    wearableImageUrls: mergeImageUrls(categoryWarmupImageUrls.wearableImageUrls, intentWearableImageUrls),
    warmupAvatarItem,
  }
}

function areSameImageUrls(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false

  return left.every((imageUrl, index) => imageUrl === right[index])
}
