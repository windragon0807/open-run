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
    id: '00028',
    imageUrl: '/temp/avatar/nft_upperClothing_1.png',
    rarity: 'common',
    name: 'upper_clothing_1',
    mainCategory: 'upperClothing',
    subCategory: null,
    link: '',
  },
  lowerClothing: {
    id: '00021',
    imageUrl: '/temp/avatar/nft_lowerClothing_2.png',
    rarity: 'common',
    name: 'lower_clothing_2',
    mainCategory: 'lowerClothing',
    subCategory: null,
    link: '',
  },
  footwear: {
    id: '00034',
    imageUrl: '/temp/avatar/nft_footwear_3.png',
    rarity: 'common',
    name: 'footwear_3',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  face: {
    id: '00012',
    imageUrl: '/temp/avatar/nft_face_5.png',
    rarity: 'common',
    name: 'face_5',
    mainCategory: 'face',
    subCategory: null,
    link: '',
  },
  skin: {
    id: '00024',
    imageUrl: '/temp/avatar/nft_skin_1.png',
    rarity: 'common',
    name: 'skin_1',
    mainCategory: 'skin',
    subCategory: null,
    link: '',
  },
  hair: {
    id: '00013',
    imageUrl: '/temp/avatar/nft_hair_1.png',
    rarity: 'common',
    name: 'hair_1',
    mainCategory: 'hair',
    subCategory: null,
    link: '',
  },
  accessories: {
    'hair-accessories': {
      id: '00018',
      imageUrl: '/temp/avatar/nft_hair_accessories_2.png',
      rarity: 'common',
      name: 'hair_accessories_2',
      mainCategory: 'accessories',
      subCategory: 'hair-accessories',
      link: '',
    },
    'eye-accessories': null,
    'ear-accessories': {
      id: '00005',
      imageUrl: '/temp/avatar/nft_ear_accessories_2.png',
      rarity: 'common',
      name: 'ear_accessories_2',
      mainCategory: 'accessories',
      subCategory: 'ear-accessories',
      link: '',
    },
    'body-accessories': {
      id: '00003',
      imageUrl: '/temp/avatar/nft_body_accessories_3.png',
      rarity: 'common',
      name: 'body_accessories_3',
      mainCategory: 'accessories',
      subCategory: 'body-accessories',
      link: '',
    },
  },
  background: {
    id: '00037',
    imageUrl: '/temp/avatar/avatar_bg.png',
    rarity: 'common',
    name: 'avatar_bg',
    mainCategory: 'background',
    subCategory: null,
    link: '',
  },
}
