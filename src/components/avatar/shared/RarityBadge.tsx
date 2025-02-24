import { Rarity } from '@type/avatar'
import RarityIcon from './RarityIcon'

export default function RarityBadge({ rarity }: { rarity: Rarity }) {
  if (rarity === 'common') {
    return <CommonBadge />
  }

  if (rarity === 'rare') {
    return <RareBadge />
  }

  if (rarity === 'epic') {
    return <EpicBadge />
  }

  return null
}

function CommonBadge() {
  return (
    <div className='mb-8 rounded-4 bg-white px-8 py-2 shadow-floating-primary'>
      <span className='rarity-common pr-2 font-jost text-12 font-black uppercase italic'>common</span>
    </div>
  )
}

function RareBadge() {
  return (
    <div className='relative mb-8 rounded-4 bg-white py-0 pl-10 pr-8 shadow-floating-primary'>
      <RarityIcon className='absolute -left-14 -top-2' rarity='rare' size={28} />
      <span className='rarity-rare pr-2 font-jost text-12 font-black uppercase italic'>rare</span>
    </div>
  )
}

function EpicBadge() {
  return (
    <div className='relative mb-8 rounded-4 bg-white py-0 pl-10 pr-8 shadow-floating-primary'>
      <RarityIcon className='absolute -left-14 -top-2' rarity='epic' size={28} />
      <span className='rarity-epic pr-2 font-jost text-12 font-black uppercase italic'>epic</span>
    </div>
  )
}
