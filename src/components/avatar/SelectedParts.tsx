import Image from 'next/image'

export default function SelectedParts() {
  const parts = ['head', 'eye', 'ear', 'body'] // 예시 파츠

  return (
    <div className='h-[56px] overflow-x-auto whitespace-nowrap px-5'>
      <div className='inline-flex items-center h-full space-x-[18px]'>
        {parts.map((part) => (
          <div key={part} className='w-6 h-6'>
            <Image src={`/temp/${part}.png`} alt={part} width={24} height={24} />
          </div>
        ))}
      </div>
    </div>
  )
}
