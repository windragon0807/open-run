import Image from 'next/image'

export default function Avatar({ size, imageSrc, className }: { size: number; imageSrc: string; className?: string }) {
  return (
    <div className={`relative aspect-[1] rounded-[100%] bg-black-default ${className}`} style={{ width: size }}>
      <Image src={imageSrc} alt='' width={size} height={size} />
    </div>
  )
}
