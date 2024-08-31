'use client'

import { useState } from 'react'
import Image from 'next/image'

import Spacing from '@shared/Spacing'

type Category = '상의' | '신발' | '악세서리' | '배경'

export default function Avatars() {
  const [category, setCategory] = useState<Category>('상의')

  return (
    <section className='w-full h-[calc(100%-270px)]'>
      <div className='w-full h-72 flex items-center justify-center gap-6'>
        <button
          className={`${iconBoxStyles} ${category === '상의' ? 'bg-white' : ''}`}
          onClick={() => setCategory('상의')}>
          <ClothIcon color={category === '상의' ? 'black' : 'white'} />
        </button>
        <button
          className={`${iconBoxStyles} ${category === '신발' ? 'bg-white' : ''}`}
          onClick={() => setCategory('신발')}>
          <ShoeIcon color={category === '신발' ? 'black' : 'white'} />
        </button>
        <button
          className={`${iconBoxStyles} ${category === '악세서리' ? 'bg-white' : ''}`}
          onClick={() => setCategory('악세서리')}>
          <GlassesIcon color={category === '악세서리' ? 'black' : 'white'} />
        </button>
        <button
          className={`${iconBoxStyles} ${category === '배경' ? 'bg-white' : ''}`}
          onClick={() => setCategory('배경')}>
          <ImageIcon color={category === '배경' ? 'black' : 'white'} />
        </button>
      </div>
      <Spacing size={16} />
      <div className='h-[calc(100%-88px)] overflow-y-auto px-16'>
        <div className='grid grid-cols-3 gap-x-[18px] gap-y-[20px]'>
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className='relative aspect-square flex items-center justify-center bg-[rgba(255,255,255,0.20)] rounded-4 border border-[rgba(255,255,255,0.20)]'>
              <Image className='absolute left-8 top-12' src='/images/img_new.png' alt='' width={29} height={16} />
              파츠 {index + 1}
            </div>
          ))}
        </div>
        <Spacing size={30} />
      </div>
    </section>
  )
}

const iconBoxStyles: HTMLDivElement['className'] = 'w-40 aspect-[1] rounded-4 flex justify-center items-center'

function ClothIcon({ color }: { color: string }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5 11.5L6 10.95V20C6 20.2833 6.09583 20.5208 6.2875 20.7125C6.47916 20.9042 6.71666 21 7 21H17C17.2833 21 17.5208 20.9042 17.7125 20.7125C17.9042 20.5208 18 20.2833 18 20V10.975L19 11.475C19.25 11.6083 19.5042 11.6458 19.7625 11.5875C20.0208 11.5292 20.2167 11.3833 20.35 11.15L22.35 7.65C22.4833 7.41667 22.5167 7.16667 22.45 6.9C22.3833 6.63333 22.2333 6.43333 22 6.3L16.25 3H14.5C14.35 3 14.2292 3.04583 14.1375 3.1375C14.0458 3.22917 14 3.35 14 3.5V4C14 4.55 13.8042 5.02083 13.4125 5.4125C13.0208 5.80417 12.55 6 12 6C11.45 6 10.9792 5.80417 10.5875 5.4125C10.1958 5.02083 10 4.55 10 4V3.5C10 3.35 9.95416 3.22917 9.8625 3.1375C9.77083 3.04583 9.65 3 9.5 3H7.75L2 6.3C1.76666 6.43333 1.61666 6.63333 1.55 6.9C1.48333 7.16667 1.51666 7.41667 1.65 7.65L3.65 11.15C3.78333 11.3833 3.98333 11.5333 4.25 11.6C4.51666 11.6667 4.76666 11.6333 5 11.5Z'
        fill={color}
      />
    </svg>
  )
}

function ShoeIcon({ color }: { color: string }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        d='M5.4 9.49998C6.05 9.49998 6.66667 9.61664 7.25 9.84998C7.83334 10.0833 8.36667 10.425 8.85 10.875L18.4 20H19C19.2833 20 19.5208 19.9041 19.7125 19.7125C19.9042 19.5208 20 19.2833 20 19C20 18.8666 19.9875 18.725 19.9625 18.575C19.9375 18.425 19.85 18.275 19.7 18.125L15.125 13.55L13.35 8.19998L11.5 8.64998C10.8667 8.81664 10.2917 8.69998 9.775 8.29998C9.25834 7.89998 9 7.37498 9 6.72498V4.62498L8.3 4.27498L4.45 9.42498C4.43334 9.44164 4.425 9.45414 4.425 9.46248C4.425 9.47081 4.41667 9.48331 4.4 9.49998H5.4ZM5.4 11.5H4.25C4.3 11.6166 4.3625 11.725 4.4375 11.825C4.5125 11.925 4.6 12.0166 4.7 12.1L12.8 19.475C12.9833 19.6583 13.1917 19.7916 13.425 19.875C13.6583 19.9583 13.9 20 14.15 20H15.5L7.475 12.325C7.19167 12.0416 6.87084 11.8333 6.5125 11.7C6.15417 11.5666 5.78334 11.5 5.4 11.5ZM14.15 22C13.65 22 13.175 21.9083 12.725 21.725C12.275 21.5416 11.8583 21.2833 11.475 20.95L3.35 13.575C2.58334 12.875 2.15417 12.0166 2.0625 11C1.97084 9.98331 2.23334 9.05831 2.85 8.22498L6.7 3.07498C6.98334 2.69164 7.3625 2.43748 7.8375 2.31248C8.3125 2.18748 8.76667 2.24164 9.2 2.47498L9.9 2.82498C10.25 3.00831 10.5208 3.25831 10.7125 3.57498C10.9042 3.89164 11 4.24164 11 4.62498V6.72498L12.85 6.24998C13.35 6.11664 13.8333 6.17914 14.3 6.43748C14.7667 6.69581 15.0833 7.06664 15.25 7.54998L16.875 12.45L21.125 16.7C21.4583 17.0333 21.6875 17.3916 21.8125 17.775C21.9375 18.1583 22 18.5666 22 19C22 19.8333 21.7083 20.5416 21.125 21.125C20.5417 21.7083 19.8333 22 19 22H14.15Z'
        fill={color}
      />
    </svg>
  )
}

function GlassesIcon({ color }: { color: string }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <rect x='10' y='11' width='4' height='2' fill={color} />
      <circle cx='6' cy='12' r='4' stroke={color} strokeWidth='2' />
      <circle cx='18' cy='12' r='4' stroke={color} strokeWidth='2' />
    </svg>
  )
}

function ImageIcon({ color }: { color: string }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <rect x='4' y='4' width='16' height='16' rx='1' stroke={color} strokeWidth='2' />
      <rect x='7' y='7' width='3' height='3' rx='1.5' fill={color} />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3 17.3663V15.5858L6.79289 11.7929L7.37258 11.2132L8.0547 11.668L10.3726 13.2132L13.7929 9.79292L14.5 9.08582L15.2071 9.79292L21 15.5858V17.3663C20.6176 17.5874 20.1201 17.5343 19.7929 17.2071L14.5 11.9142L11.2071 15.2071L10.6274 15.7868L9.9453 15.3321L7.62742 13.7868L4.20711 17.2071C3.87992 17.5343 3.38243 17.5874 3 17.3663Z'
        fill={color}
      />
    </svg>
  )
}
