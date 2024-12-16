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
export type SubCategory = 'hair-accessories' | 'eye-accessories' | 'ear-accessories' | 'body-accessories'

export type Avatar = {
  id: string
  imageUrl: string
  rarity: string
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
    'hair-accessories': Avatar | null
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
