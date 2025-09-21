import { Metadata } from 'next'
import StatusList from '@components/challenges/StatusList'
import StatusTab from '@components/challenges/StatusTab'
import CompletedList from '@components/challenges/completed/CompletedList'
import ProgressList from '@components/challenges/progress/ProgressList'

export default async function Page() {
  return (
    <section className='h-full w-full bg-gray-lighten'>
      <div className='h-full pt-32 app:pt-72'>
        <header className='mb-32 flex items-center justify-between px-24'>
          <h1 className='text-28 font-bold'>도전 과제</h1>
          <StatusTab />
        </header>
        <StatusList progress={<ProgressList />} completed={<CompletedList />} />
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: '도전 과제',
}
