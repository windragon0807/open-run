import Image from 'next/image'

import Layout from '@shared/Layout'
import Header from '@components/avatar/Header'
import Avatars from '@components/avatar/Avatars'
import Spacing from '@/components/shared/Spacing'

export default function AvatarPage() {
  return (
    <Layout>
      <Header />
      <section className='w-full h-[calc(100%-60px)] bg-gradient-main bg-cover flex flex-col items-center'>
        <Spacing size={24} />
        <div className='w-184 h-230 relative'>
          <Image className='absolute' src='/temp/nft_bg.png' alt='NFT Background' width={184} height={184} />
          <Image className='absolute' src='/temp/nft_character_lg.png' alt='NFT Character' width={184} height={230} />
        </div>
        <Spacing size={16} />
        <Avatars />
      </section>
    </Layout>
  )
}
