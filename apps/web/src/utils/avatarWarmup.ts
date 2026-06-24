import { Avatar, SelectedCategory, WearingAvatar } from '@type/avatar'
import {
  getAvatarPreviewImageWarmupUrls,
  getAvatarWearableImageUrls,
  getAvatarWearableImageWarmupUrls,
} from '@utils/avatarImage'

const AVATAR_GRID_COLUMN_COUNT = 3
const HOME_PREVIEW_WARMUP_ROW_COUNT = 4
const HOME_WEARABLE_WARMUP_ROW_COUNT = 3
const AVATAR_VISIBLE_ROW_COUNT = 4
const AVATAR_PREVIEW_OVERSCAN_ROW_COUNT = 4
const AVATAR_WEARABLE_OVERSCAN_ROW_COUNT = 2

export const HOME_AVATAR_PREVIEW_WARMUP_LIMIT = getAvatarGridWarmupLimit(HOME_PREVIEW_WARMUP_ROW_COUNT)
export const HOME_AVATAR_WEARABLE_WARMUP_LIMIT = getAvatarGridWarmupLimit(HOME_WEARABLE_WARMUP_ROW_COUNT)
export const AVATAR_PAGE_PREVIEW_WARMUP_LIMIT = getAvatarGridWarmupLimit(
  AVATAR_VISIBLE_ROW_COUNT + AVATAR_PREVIEW_OVERSCAN_ROW_COUNT,
)
export const AVATAR_PAGE_WEARABLE_WARMUP_LIMIT = getAvatarGridWarmupLimit(
  AVATAR_VISIBLE_ROW_COUNT + AVATAR_WEARABLE_OVERSCAN_ROW_COUNT,
)

type AvatarWarmupImageUrls = {
  previewImageUrls: string[]
  wearableImageUrls: string[]
}

export function getHomeAvatarWarmupImageUrls(
  avatarList: Avatar[],
  wearingAvatar: WearingAvatar | null | undefined,
): AvatarWarmupImageUrls {
  const previewImageUrls = getAvatarPreviewImageWarmupUrls(avatarList, {
    mainCategory: 'upperClothing',
    subCategory: null,
    limit: HOME_AVATAR_PREVIEW_WARMUP_LIMIT,
  })
  const currentWearingImageUrls = getWearingAvatarImageUrls(wearingAvatar)
  const initialWearableImageUrls = getAvatarWearableImageWarmupUrls(avatarList, {
    mainCategory: 'upperClothing',
    subCategory: null,
    limit: HOME_AVATAR_WEARABLE_WARMUP_LIMIT,
  })

  return {
    previewImageUrls,
    wearableImageUrls: mergeImageUrls(currentWearingImageUrls, initialWearableImageUrls),
  }
}

export function getAvatarPageWarmupImageUrls(
  avatarList: Avatar[],
  selectedCategory: SelectedCategory,
): AvatarWarmupImageUrls {
  const { mainCategory, subCategory } = selectedCategory

  if (avatarList.length === 0) {
    return {
      previewImageUrls: [],
      wearableImageUrls: [],
    }
  }

  if (mainCategory == null) {
    return {
      previewImageUrls: getAvatarPreviewImageWarmupUrls(avatarList, {
        limit: AVATAR_PAGE_PREVIEW_WARMUP_LIMIT,
      }),
      wearableImageUrls: [],
    }
  }

  return {
    previewImageUrls: getAvatarPreviewImageWarmupUrls(avatarList, {
      mainCategory,
      subCategory,
      limit: AVATAR_PAGE_PREVIEW_WARMUP_LIMIT,
    }),
    wearableImageUrls: getAvatarWearableImageWarmupUrls(avatarList, {
      mainCategory,
      subCategory,
      limit: AVATAR_PAGE_WEARABLE_WARMUP_LIMIT,
    }),
  }
}

export function getWearingAvatarImageUrls(wearingAvatar: WearingAvatar | null | undefined): string[] {
  if (wearingAvatar == null) return []

  return uniqueImageUrls(
    [
      wearingAvatar.fullSet,
      wearingAvatar.upperClothing,
      wearingAvatar.lowerClothing,
      wearingAvatar.footwear,
      wearingAvatar.face,
      wearingAvatar.skin,
      wearingAvatar.hair,
      wearingAvatar.accessories['head-accessories'],
      wearingAvatar.accessories['eye-accessories'],
      wearingAvatar.accessories['ear-accessories'],
      wearingAvatar.accessories['body-accessories'],
    ].flatMap((avatar) => (avatar == null ? [] : getAvatarWearableImageUrls(avatar))),
  )
}

export function mergeImageUrls(primaryImageUrls: string[], secondaryImageUrls: string[]): string[] {
  return uniqueImageUrls([...primaryImageUrls, ...secondaryImageUrls])
}

function getAvatarGridWarmupLimit(rowCount: number): number {
  return AVATAR_GRID_COLUMN_COUNT * rowCount
}

function uniqueImageUrls(imageUrls: string[]): string[] {
  return Array.from(new Set(imageUrls))
}
