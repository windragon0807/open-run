interface AvatarPartsProps {
  selectedCategory: string
}

export default function AvatarParts({ selectedCategory }: AvatarPartsProps) {
  return (
    <div className='flex-grow overflow-y-auto px-20 pt-25 bg-[#f0f0f0]'>
      <div className='grid grid-cols-3 gap-x-[18px] gap-y-[20px]'>
        {[...Array(9)].map((_, index) => (
          <div key={index} className='aspect-square bg-gray-100 flex items-center justify-center bg-[#ffffff]'>
            파츠 {index + 1}
          </div>
        ))}
      </div>
    </div>
  )
}
