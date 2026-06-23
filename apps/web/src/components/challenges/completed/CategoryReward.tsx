import clsx from 'clsx'
import Image from 'next/image'

export default function CategoryReward({
  categoryLabel,
  highlighted = false,
  imageSrc,
  imageAlt,
}: {
  categoryLabel: string
  highlighted?: boolean
  imageSrc: string | null
  imageAlt: string
}) {
  return (
    <article className='relative flex size-60 items-center justify-center'>
      <Category label={categoryLabel} highlighted={highlighted} />
      <div className='flex size-48 items-center justify-center rounded-full bg-gradient-achievement-gray'>
        {imageSrc != null && (
          <Image src={imageSrc} alt={imageAlt} width={32} height={32} className='object-contain' />
        )}
      </div>
    </article>
  )
}

function Category({ label, highlighted }: { label: string; highlighted: boolean }) {
  return (
    <span
      className={clsx(
        'absolute left-0 top-0 rounded-25 px-4 py-2 text-10 font-medium text-white',
        highlighted ? 'bg-primary' : 'bg-black',
      )}>
      {label}
    </span>
  )
}
