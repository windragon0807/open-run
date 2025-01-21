export type MainCategory =
  | 'upperClothing'
  | 'lowerClothing'
  | 'fullSet'
  | 'footwear'
  | 'face'
  | 'skin'
  | 'hair'
  | 'accessories'
  | 'background'
export type SubCategory = 'head-accessories' | 'eye-accessories' | 'ear-accessories' | 'body-accessories'
export type Rarity = 'common' | 'rare' | 'epic'

export type Avatar = {
  id: string
  imageUrl: string | string[]
  thumbnailUrl: string
  rarity: Rarity
  name: string
  mainCategory: MainCategory
  subCategory: SubCategory | null
  link: string
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
  background: Avatar | null
}

export type SelectedCategory = {
  mainCategory: MainCategory | null
  subCategory: SubCategory | null
}
