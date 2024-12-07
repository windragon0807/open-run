import { ElementType, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FullSetIcon,
  UpperClothingIcon,
  LowerClothingIcon,
  FootwearIcon,
  FaceIcon,
  SkinIcon,
  HairIcon,
  AccessoriesIcon,
  BackgroundIcon,
} from './icons'
import { MainCategory, SelectedCategory, SubCategory } from '@/types/avatar'

const categoryList: {
  mainCategory: MainCategory
  icon: ElementType
}[] = [
  { mainCategory: 'fullSet', icon: FullSetIcon },
  { mainCategory: 'upperClothing', icon: UpperClothingIcon },
  { mainCategory: 'lowerClothing', icon: LowerClothingIcon },
  { mainCategory: 'footwear', icon: FootwearIcon },
  { mainCategory: 'face', icon: FaceIcon },
  { mainCategory: 'skin', icon: SkinIcon },
  { mainCategory: 'hair', icon: HairIcon },
  {
    mainCategory: 'accessories',
    icon: AccessoriesIcon,
  },
  { mainCategory: 'background', icon: BackgroundIcon },
]

const subCategoryList: {
  subCategory: SubCategory
  label: string
}[] = [
  { subCategory: 'hair-accessories', label: '머리 장식' },
  { subCategory: 'eye-accessories', label: '눈 장식' },
  { subCategory: 'ear-accessories', label: '귀 장식' },
  { subCategory: 'body-accessories', label: '몸 장식' },
]

export default function Category({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: SelectedCategory
  setSelectedCategory: (category: SelectedCategory) => void
}) {
  return (
    <section className='w-full flex flex-col gap-16 pt-16 pb-24'>
      <div className='w-full px-16 overflow-x-auto flex items-center gap-6'>
        {categoryList.map((item) => (
          <button
            key={item.mainCategory}
            className={`flex-shrink-0 w-40 h-40 rounded-4 flex items-center justify-center ${
              selectedCategory.mainCategory === item.mainCategory ? 'bg-gray' : ''
            }`}
            onClick={() =>
              setSelectedCategory(
                selectedCategory.mainCategory === item.mainCategory
                  ? { mainCategory: null, subCategory: null }
                  : { mainCategory: item.mainCategory, subCategory: null },
              )
            }>
            <item.icon />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selectedCategory.mainCategory === 'accessories' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='overflow-hidden'>
            <div className='flex gap-4 items-center px-16 overflow-x-auto'>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-8 py-2 rounded-4 text-sm ${
                  selectedCategory.subCategory === null ? 'bg-gray font-bold' : ''
                }`}
                onClick={() => setSelectedCategory({ ...selectedCategory, subCategory: null })}>
                전체
              </motion.button>
              <div className='border-l border-gray w-1 h-16 ml-4 mr-4' />
              {subCategoryList.map((subItem) => (
                <motion.button
                  key={subItem.subCategory}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 px-8 py-2 rounded-4 text-sm ${
                    selectedCategory.subCategory === subItem.subCategory ? 'bg-gray font-bold' : ''
                  }`}
                  onClick={() => setSelectedCategory({ ...selectedCategory, subCategory: subItem.subCategory })}>
                  {subItem.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
