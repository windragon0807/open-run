import { ResponseType } from './type'

export function fetchWearingAvatar(): Promise<ResponseType> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'success',
        data: mockData,
      })
    }, 100)
  })
}

const mockData: ResponseType['data'] = {
  fullSet: null,
  upperClothing: {
    id: '00053',
    imageUrl: '/temp/avatar/upperClothing/nft_upperClothing_1.png',
    thumbnailUrl: '/temp/avatar/upperClothing/nft_upperClothing_1.png',
    rarity: 'common',
    name: 'upperClothing_1',
    mainCategory: 'upperClothing',
    subCategory: null,
    link: '',
  },
  lowerClothing: {
    id: '00041',
    imageUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_1.png',
    thumbnailUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_1.png',
    rarity: 'common',
    name: 'lowerClothing_1',
    mainCategory: 'lowerClothing',
    subCategory: null,
    link: '',
  },
  footwear: {
    id: '00036',
    imageUrl: '/temp/avatar/footwear/nft_footwear_1.png',
    thumbnailUrl: '/temp/avatar/footwear/nft_footwear_1.png',
    rarity: 'common',
    name: 'footwear_1',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  face: {
    id: '00031',
    imageUrl: '/temp/avatar/face/nft_face_1.png',
    thumbnailUrl: '/temp/avatar/face/nft_face_1.png',
    rarity: 'common',
    name: 'face_1',
    mainCategory: 'face',
    subCategory: null,
    link: '',
  },
  skin: {
    id: '00046',
    imageUrl: '/temp/avatar/skin/nft_skin_1.png',
    thumbnailUrl: '/temp/avatar/skin/nft_skin_1.png',
    rarity: 'common',
    name: 'skin_1',
    mainCategory: 'skin',
    subCategory: null,
    link: '',
  },
  hair: {
    id: '00058',
    imageUrl: ['/temp/avatar/hair/front/nft_hair_front_1.png', '/temp/avatar/hair/back/nft_hair_back_1.png'],
    thumbnailUrl: '/temp/avatar/hair/front/nft_hair_front_1.png',
    rarity: 'common',
    name: 'hair_1',
    mainCategory: 'hair',
    subCategory: null,
    link: '',
  },
  accessories: {
    'head-accessories': {
      id: '00021',
      imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_1.png',
      thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_1.png',
      rarity: 'common',
      name: 'head_accessory_1',
      mainCategory: 'accessories',
      subCategory: 'head-accessories',
      link: '',
    },
    'eye-accessories': null,
    'ear-accessories': {
      id: '00011',
      imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_1.png',
      thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_1.png',
      rarity: 'common',
      name: 'ear_accessory_1',
      mainCategory: 'accessories',
      subCategory: 'ear-accessories',
      link: '',
    },
    'body-accessories': {
      id: '00001',
      imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_1.png',
      thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_1.png',
      rarity: 'common',
      name: 'body_accessory_1',
      mainCategory: 'accessories',
      subCategory: 'body-accessories',
      link: '',
    },
  },
  background: {
    id: '00061',
    imageUrl: '/temp/avatar/background/nft_background.png',
    thumbnailUrl: '/temp/avatar/background/nft_background.png',
    rarity: 'common',
    name: 'background',
    mainCategory: 'background',
    subCategory: null,
    link: '',
  },
}
