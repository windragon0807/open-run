import { Avatar, MainCategory, SelectedCategory, SubCategory } from '@type/avatar'

export const AVATAR_DEFAULT_PREVIEW_IMAGE_URL = '/images/avatars/avatar_default_body.png'

export function getAvatarPreviewImageUrl(
  avatar: Avatar,
  fallbackImageUrl = AVATAR_DEFAULT_PREVIEW_IMAGE_URL,
): string {
  if (avatar.thumbnailUrl) return avatar.thumbnailUrl

  return getAvatarWearableImageUrls(avatar)[0] ?? fallbackImageUrl
}

export function getAvatarWearableImageUrls(avatar: Avatar): string[] {
  if (Array.isArray(avatar.imageUrl)) {
    return avatar.imageUrl.filter(isPresentImageUrl)
  }

  return isPresentImageUrl(avatar.imageUrl) ? [avatar.imageUrl] : []
}

export function getSelectedCategoryAvatarItems(
  avatarList: Avatar[],
  selectedCategory: SelectedCategory,
): Avatar[] {
  return avatarList.filter((avatar) => isAvatarInSelectedCategory(avatar, selectedCategory))
}

export function getCategoryWearableImageUrls(
  avatarList: Avatar[],
  mainCategory: MainCategory,
  subCategory: SubCategory | null,
  limit = Infinity,
): string[] {
  return uniqueImageUrls(
    avatarList
      .filter((avatar) => isAvatarInCategory(avatar, mainCategory, subCategory))
      .flatMap(getAvatarWearableImageUrls),
  ).slice(0, limit)
}

export function getCategoryPreviewImageUrls(
  avatarList: Avatar[],
  mainCategory: MainCategory,
  subCategory: SubCategory | null,
  limit = Infinity,
): string[] {
  return uniqueImageUrls(
    avatarList
      .filter((avatar) => isAvatarInCategory(avatar, mainCategory, subCategory))
      .map((avatar) => getAvatarPreviewImageUrl(avatar))
      .filter(isPresentImageUrl),
  ).slice(0, limit)
}

export function getAvatarWearableImageWarmupUrls(
  avatarList: Avatar[],
  {
    mainCategory,
    subCategory,
    limit = Infinity,
  }: {
    mainCategory: MainCategory
    subCategory: SubCategory | null
    limit?: number
  },
): string[] {
  return getCategoryWearableImageUrls(avatarList, mainCategory, subCategory, limit)
}

export function getAvatarPreviewImageWarmupUrls(
  avatarList: Avatar[],
  {
    mainCategory = null,
    subCategory = null,
    limit = Infinity,
  }: {
    mainCategory?: MainCategory | null
    subCategory?: SubCategory | null
    limit?: number
  },
): string[] {
  if (mainCategory == null) {
    return uniqueImageUrls(
      avatarList
        .map((avatar) => getAvatarPreviewImageUrl(avatar))
        .filter(isPresentImageUrl),
    ).slice(0, limit)
  }

  return getCategoryPreviewImageUrls(avatarList, mainCategory, subCategory, limit)
}

function isAvatarInSelectedCategory(avatar: Avatar, selectedCategory: SelectedCategory): boolean {
  if (selectedCategory.mainCategory == null) return true

  return isAvatarInCategory(avatar, selectedCategory.mainCategory, selectedCategory.subCategory)
}

function isAvatarInCategory(
  avatar: Avatar,
  mainCategory: MainCategory,
  subCategory: SubCategory | null,
): boolean {
  if (avatar.mainCategory !== mainCategory) return false
  if (subCategory == null) return true

  return avatar.subCategory === subCategory
}

function uniqueImageUrls(imageUrls: string[]): string[] {
  return Array.from(new Set(imageUrls))
}

function isPresentImageUrl(imageUrl: string | null | undefined): imageUrl is string {
  return imageUrl != null && imageUrl !== ''
}
