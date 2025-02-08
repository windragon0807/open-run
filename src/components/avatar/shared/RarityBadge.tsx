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
    <div className='bg-white px-8 py-2 rounded-4 mb-8 shadow-floating-primary'>
      <span className='font-jost text-12 leading-16 font-black italic uppercase rarity-common pr-2'>common</span>
    </div>
  )
}

function RareBadge() {
  return (
    <div className='relative bg-white pr-8 pl-10 py-0 rounded-4 mb-8 shadow-floating-primary'>
      <RarityIcon className='absolute -top-2 -left-14' rarity='rare' size={28} />
      <span className='font-jost text-12 leading-16 font-black italic uppercase rarity-rare pr-2'>rare</span>
    </div>
  )
}

function EpicBadge() {
  return (
    <div className='relative bg-white pl-10 pr-8 py-0 rounded-4 mb-8 shadow-floating-primary'>
      <RarityIcon className='absolute -top-2 -left-14' rarity='epic' size={28} />
      <span className='font-jost text-12 leading-16 font-black italic uppercase rarity-epic pr-2'>epic</span>
    </div>
  )
}
