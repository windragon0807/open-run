import Image from 'next/image'

export default function AvatarPreview() {
  return (
    <div className='h-[341px] relative p-[25px] pb-0'>
      <div className='relative h-full'>
        <Image src='/temp/nft_bg.png' alt='NFT Background' layout='fill' objectFit='contain' />
        <Image src='/temp/nft_character_lg.png' alt='NFT Character' layout='fill' objectFit='contain' />
      </div>
      <button className='absolute top-8 right-8 bg-white rounded-full p-2'>
        <Image src='/icons/refresh.svg' alt='Refresh' width={24} height={24} />
      </button>
    </div>
  )
}
