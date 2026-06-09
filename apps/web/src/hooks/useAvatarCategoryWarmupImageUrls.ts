import { useMemo } from 'react'
import { Avatar, SelectedCategory } from '@type/avatar'
import {
  getAvatarPreviewImageWarmupUrls,
  getAvatarWearableImageWarmupUrls,
} from '@utils/avatarImage'

const PAGE_PREVIEW_IMAGE_WARMUP_LIMIT = 72
const CATEGORY_PREVIEW_IMAGE_WARMUP_LIMIT = 24
const CATEGORY_WEARABLE_IMAGE_WARMUP_LIMIT = 18

type AvatarCategoryWarmupImageUrls = {
  previewImageUrls: string[]
  wearableImageUrls: string[]
}

export function useAvatarCategoryWarmupImageUrls(
  avatarList: Avatar[],
  selectedCategory: SelectedCategory,
): AvatarCategoryWarmupImageUrls {
  const { mainCategory, subCategory } = selectedCategory

  return useMemo(() => {
    if (avatarList.length === 0) {
      return {
        previewImageUrls: [],
        wearableImageUrls: [],
      }
    }

    const pagePreviewImageUrls = getAvatarPreviewImageWarmupUrls(avatarList, {
      limit: PAGE_PREVIEW_IMAGE_WARMUP_LIMIT,
    })

    if (mainCategory == null) {
      return {
        previewImageUrls: pagePreviewImageUrls,
        wearableImageUrls: [],
      }
    }

    const categoryPreviewImageUrls = getAvatarPreviewImageWarmupUrls(avatarList, {
      mainCategory,
      subCategory,
      limit: CATEGORY_PREVIEW_IMAGE_WARMUP_LIMIT,
    })

    const wearableImageUrls = getAvatarWearableImageWarmupUrls(avatarList, {
      mainCategory,
      subCategory,
      limit: CATEGORY_WEARABLE_IMAGE_WARMUP_LIMIT,
    })

    return {
      previewImageUrls: mergeImageUrls(categoryPreviewImageUrls, pagePreviewImageUrls),
      wearableImageUrls,
    }
  }, [avatarList, mainCategory, subCategory])
}

function mergeImageUrls(primaryImageUrls: string[], secondaryImageUrls: string[]): string[] {
  return Array.from(new Set([...primaryImageUrls, ...secondaryImageUrls]))
}
