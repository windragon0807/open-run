import { Metadata } from 'next'
import StatusList from '@components/achievement/StatusList'
import StatusTab from '@components/achievement/StatusTab'
import CompletedList from '@components/achievement/completed/CompletedList'
import ProgressList from '@components/achievement/progress/ProgressList'

export default async function Page() {
  return (
    <section className='h-full w-full bg-gray-lighten'>
      <div className='app:pt-72 h-full pt-32'>
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
