export type MainCategory =
  | 'upperClothing'
  | 'lowerClothing'
  | 'fullSet'
  | 'footwear'
  | 'face'
  | 'skin'
  | 'hair'
  | 'accessories'
export type SubCategory = 'head-accessories' | 'eye-accessories' | 'ear-accessories' | 'body-accessories'
export type Rarity = 'common' | 'rare' | 'epic'

export type Avatar = {
  id: string
  /** ERC-1155 token id (string). 절대 숫자로 파싱하지 마세요 — MAX_SAFE_INTEGER를 초과할 수 있습니다. */
  tokenId?: string | null
  balance?: string | null
  imageUrl: string | string[] | null
  thumbnailUrl: string | null
  rarity: Rarity
  name: string
  mainCategory: MainCategory
  subCategory: SubCategory | null
  link?: string
}

export type WearingAvatar = {
  fullSet: Avatar | null
  upperClothing: Avatar | null
  lowerClothing: Avatar | null
  footwear: Avatar | null
  face: Avatar | null
  skin: Avatar | null
  hair: Avatar | null
  accessories: {
    'head-accessories': Avatar | null
    'eye-accessories': Avatar | null
    'ear-accessories': Avatar | null
    'body-accessories': Avatar | null
  }
}

export type SelectedCategory = {
  mainCategory: MainCategory | null
  subCategory: SubCategory | null
}
