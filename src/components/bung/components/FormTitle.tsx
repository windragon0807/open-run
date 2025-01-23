export default function FormTitle({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <div className='relative w-fit'>
      <span className='text-sm leading-[24px] -tracking-[0.28px] font-bold text-black dark:text-white'>{children}</span>
      {required && (
        <svg className='absolute top-2 -right-6 fill-primary' width='4' height='4' viewBox='0 0 4 4' fill='none'>
          <circle cx='2' cy='2' r='2' />
        </svg>
      )}
    </div>
  )
}
