import { ResponseType } from './type'

export function fetchNftList(): Promise<ResponseType> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'success',
        data: mockData,
      })
    }, 100)
  })
}

const mockData: ResponseType['data'] = [
  {
    id: '00001',
    imageUrl: '/temp/avatar/nft_1.png',
    rarity: 'common',
    name: '첫 번째 풀세트',
    mainCategory: 'fullSet',
    subCategory: null,
    link: '',
  },
  {
    id: '00002',
    imageUrl: '/temp/avatar/nft_2.png',
    rarity: 'common',
    name: '첫 번째 신발',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  {
    id: '00003',
    imageUrl: '/temp/avatar/nft_3.png',
    rarity: 'common',
    name: '두 번째 신발',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  {
    id: '00004',
    imageUrl: '/temp/avatar/nft_4.png',
    rarity: 'common',
    name: '세 번째 신발',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  {
    id: '00005',
    imageUrl: '/temp/avatar/nft_5.png',
    rarity: 'common',
    name: '첫 번째 배경',
    mainCategory: 'background',
    subCategory: null,
    link: '',
  },
  {
    id: '00006',
    imageUrl: '/temp/avatar/nft_6.png',
    rarity: 'common',
    name: '두 번째 풀세트',
    mainCategory: 'fullSet',
    subCategory: null,
    link: '',
  },
  {
    id: '00007',
    imageUrl: '/temp/avatar/nft_7.png',
    rarity: 'common',
    name: '네 번째 신발',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  {
    id: '00008',
    imageUrl: '/temp/avatar/nft_8.png',
    rarity: 'common',
    name: '세 번째 풀세트',
    mainCategory: 'fullSet',
    subCategory: null,
    link: '',
  },
  {
    id: '00009',
    imageUrl: '/temp/avatar/nft_9.png',
    rarity: 'common',
    name: '다섯 번째 신발',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
]
