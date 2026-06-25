import { ReactNode } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { BackgroundOpenrunIcon, OpenrunIcon } from '@icons/openrun'
import { LegalNav, LegalRouteTransition } from './LegalMotion'

export const SUPPORT_EMAIL = 'tmdfyd1995@gmail.com'
export const EFFECTIVE_DATE = '2026년 6월 25일'

type DetailItem = {
  title: string
  body: ReactNode
}

type QuickFact = {
  label: string
  value: ReactNode
}

type LegalDocumentPageProps = {
  activePath: '/privacy' | '/support'
  label: string
  title: string
  description: string
  quickFacts: QuickFact[]
  updatedAt?: string
  dateLabel?: string
  children: ReactNode
  aside?: ReactNode
}

export function LegalDocumentPage({
  activePath,
  label,
  title,
  description,
  quickFacts,
  updatedAt = EFFECTIVE_DATE,
  dateLabel = '시행일',
  children,
  aside,
}: LegalDocumentPageProps) {
  return (
    <article className='min-h-dvh bg-gray-lighten text-black-darken'>
      <header className='relative isolate overflow-hidden bg-black-darken text-white'>
        <div className='pointer-events-none absolute -right-80 top-24 text-white/5 max-sm:-right-132 max-sm:top-92' aria-hidden>
          <BackgroundOpenrunIcon size={520} color='currentColor' />
        </div>
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-secondary' aria-hidden />

        <div className='relative mx-auto flex w-full max-w-[1080px] flex-col px-20 py-20 tracking-[0] sm:px-32 sm:py-28'>
          <div className='flex items-center justify-between gap-16'>
            <Link href='/' className='flex w-fit items-center gap-10 text-16 font-black text-white'>
              <span className='flex h-32 w-32 items-center justify-center rounded-full bg-primary text-white shadow-floating-primary'>
                <OpenrunIcon size={20} color='currentColor' />
              </span>
              OpenRun
            </Link>
            <LegalNav activePath={activePath} />
          </div>

          <div className='mt-48 max-w-[760px] sm:mt-60'>
            <p className='font-jost text-12 font-black italic leading-[1.4] tracking-[0.24em] text-secondary'>{label}</p>
            <h1 className='mt-10 text-[32px] font-black leading-[1.16] tracking-[0] text-white sm:text-[40px]'>{title}</h1>
            <p className='mt-16 max-w-[680px] text-14 font-medium leading-[1.75] tracking-[0] text-white/70 sm:text-16'>{description}</p>
          </div>

          <dl className='mt-34 grid gap-1 overflow-hidden rounded-8 border border-white/10 bg-white/5 sm:grid-cols-3'>
            {quickFacts.map((fact) => (
              <div key={fact.label} className='min-w-0 p-14 sm:p-16'>
                <dt className='font-jost text-11 font-black italic leading-[1.3] tracking-[0.12em] text-secondary'>{fact.label}</dt>
                <dd className='mt-6 break-words text-14 font-bold leading-[1.5] text-white'>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className='mx-auto grid w-full max-w-[1080px] gap-28 px-20 py-28 tracking-[0] sm:px-32 sm:py-36 lg:grid-cols-[minmax(0,1fr)_280px]'>
        <main className='min-w-0'>
          <LegalRouteTransition routeKey={activePath}>{children}</LegalRouteTransition>
        </main>
        {aside != null && (
          <aside className='order-first flex flex-col gap-12 lg:sticky lg:top-24 lg:order-none lg:max-h-[calc(100dvh-48px)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]'>
            <InfoPanel title={dateLabel} tone='accent'>
              <span className='font-jost text-16 font-black italic tracking-[0.03em]'>{updatedAt}</span>
            </InfoPanel>
            {aside}
          </aside>
        )}
      </div>
    </article>
  )
}

export function LegalSection({
  checkpoint,
  title,
  children,
}: {
  checkpoint: string
  title: string
  children: ReactNode
}) {
  return (
    <section className='grid gap-12 border-t border-gray py-28 first:border-t-0 first:pt-0 sm:grid-cols-[82px_minmax(0,1fr)]'>
      <div className='flex items-center gap-8 sm:block'>
        <span className='font-jost text-12 font-black italic leading-[1.3] tracking-[0.12em] text-primary'>{checkpoint}</span>
        <span className='block h-8 w-8 rounded-full bg-secondary ring-4 ring-secondary/20 sm:mt-12' aria-hidden />
      </div>
      <div className='min-w-0'>
        <h2 className='text-20 font-bold leading-[1.4] tracking-[0] text-black-darken sm:text-22'>{title}</h2>
        <div className='mt-14 flex flex-col gap-16 text-14 leading-[1.85] tracking-[0] text-black sm:text-16'>{children}</div>
      </div>
    </section>
  )
}

export function DetailList({ items }: { items: DetailItem[] }) {
  return (
    <div className='grid gap-8'>
      {items.map((item, index) => (
        <div key={item.title} className='flex min-w-0 gap-12 rounded-8 bg-white p-14 shadow-floating-primary'>
          <span className='mt-1 flex h-32 w-32 shrink-0 items-center justify-center rounded-8 bg-gray-lighten font-jost text-12 font-black italic leading-none text-primary'>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className='min-w-0'>
            <h3 className='text-14 font-bold leading-[1.5] tracking-[0] text-black-darken sm:text-16'>{item.title}</h3>
            <div className='mt-4 text-14 leading-[1.75] tracking-[0] text-black'>{item.body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SimpleList({ items }: { items: ReactNode[] }) {
  return (
    <ul className='flex flex-col gap-8'>
      {items.map((item, index) => (
        <li key={index} className='flex gap-10'>
          <span className='mt-[11px] h-2 w-12 shrink-0 rounded-full bg-secondary' aria-hidden />
          <span className='min-w-0'>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function InfoPanel({
  title,
  children,
  tone = 'light',
}: {
  title: string
  children: ReactNode
  tone?: 'light' | 'dark' | 'accent'
}) {
  return (
    <div
      className={clsx(
        'rounded-8 p-16',
        tone === 'dark' && 'bg-black-darken text-white',
        tone === 'accent' && 'bg-secondary text-black-darken',
        tone === 'light' && 'border border-gray bg-white text-black-darken',
      )}>
      <h2 className='font-jost text-12 font-black italic leading-[1.4] tracking-[0.12em]'>{title}</h2>
      <div className={clsx('mt-8 text-14 leading-[1.7] tracking-[0]', tone === 'dark' ? 'text-white/80' : 'text-black')}>{children}</div>
    </div>
  )
}

export function MailButton({ children = '이메일로 문의하기' }: { children?: ReactNode }) {
  return (
    <a
      className='active:scale-98 mt-14 flex h-52 w-full items-center justify-center rounded-8 bg-primary px-16 text-16 font-bold text-white active-press-duration active:bg-primary-darken'
      href={`mailto:${SUPPORT_EMAIL}`}>
      {children}
    </a>
  )
}

export function MailLink({ children = SUPPORT_EMAIL }: { children?: ReactNode }) {
  return (
    <a className='break-words font-bold text-primary underline underline-offset-4' href={`mailto:${SUPPORT_EMAIL}`}>
      {children}
    </a>
  )
}
