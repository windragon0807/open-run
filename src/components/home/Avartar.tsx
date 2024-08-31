import Image from 'next/image'

export default function Avartar({ size, imageSrc, className }: { size: number; imageSrc: string; className?: string }) {
  return (
    <div
      className={`relative bg-black dark:bg-gray-lighten rounded-[100%] aspect-[1] ${className}`}
      style={{ width: size }}>
      <Image src={imageSrc} alt='' width={size} height={size} />
    </div>
  )
}
