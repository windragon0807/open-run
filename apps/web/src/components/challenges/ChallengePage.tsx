'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import ErrorFallback from '@shared/ErrorFallback'
import type { CompletedChallengeWithNftListResponse } from '@apis/v1/challenges/completed'
import { useCompletedChallengeWithNftListQuery } from '@apis/v1/challenges/completed/query'
import type { GeneralChallengeListResponse } from '@apis/v1/challenges/general'
import { useGeneralChallengeListQuery } from '@apis/v1/challenges/general/query'
import type { RepetitiveChallengeListResponse } from '@apis/v1/challenges/repetitive'
import { useRepetitiveChallengeListQuery } from '@apis/v1/challenges/repetitive/query'
import type { CategoryType, ListType } from '@type/challenge'
import ListTab from './ListTab'
import CompletedList from './completed/CompletedList'
import CategoryTab from './progress/CategoryTab'
import GeneralList from './progress/general/GeneralList'
import RepetitiveList from './progress/repetitive/RepetitiveList'

type ProgressCategory = Extract<CategoryType, 'general' | 'repetitive'>
type ChallengeView = 'completed' | ProgressCategory

type ReadyChallengeView =
  | { view: 'completed'; response: CompletedChallengeWithNftListResponse }
  | { view: 'general'; response: GeneralChallengeListResponse }
  | { view: 'repetitive'; response: RepetitiveChallengeListResponse }

const CHALLENGE_LIST_SKELETON_COUNT = 10

export default function ChallengePage() {
  const searchParams = useSearchParams()
  const urlSelectedList = getSelectedList(searchParams.get('list'))
  const urlSelectedCategory = getSelectedCategory(searchParams.get('category'))
  const [selectedList, setSelectedList] = useState<ListType>(urlSelectedList)
  const [selectedCategory, setSelectedCategory] = useState<ProgressCategory>(urlSelectedCategory)
  const selectedView: ChallengeView = selectedList === 'progress' ? selectedCategory : 'completed'

  useEffect(() => {
    setSelectedList(urlSelectedList)
  }, [urlSelectedList])

  useEffect(() => {
    setSelectedCategory(urlSelectedCategory)
  }, [urlSelectedCategory])

  const generalQuery = useGeneralChallengeListQuery()
  const repetitiveQuery = useRepetitiveChallengeListQuery()
  const completedQuery = useCompletedChallengeWithNftListQuery()

  const readyView = useMemo<ReadyChallengeView | null>(() => {
    if (selectedView === 'general' && generalQuery.data) {
      return { view: 'general', response: generalQuery.data }
    }

    if (selectedView === 'repetitive' && repetitiveQuery.data) {
      return { view: 'repetitive', response: repetitiveQuery.data }
    }

    if (selectedView === 'completed' && completedQuery.data) {
      return { view: 'completed', response: completedQuery.data }
    }

    return null
  }, [completedQuery.data, generalQuery.data, repetitiveQuery.data, selectedView])

  const [lastReadyView, setLastReadyView] = useState<ReadyChallengeView | null>(null)

  useEffect(() => {
    if (readyView) {
      setLastReadyView(readyView)
    }
  }, [readyView])

  const activeQuery =
    selectedView === 'general' ? generalQuery : selectedView === 'repetitive' ? repetitiveQuery : completedQuery
  const displayView = readyView ?? lastReadyView
  const shouldShowError = activeQuery.isError && displayView == null
  const handleListChange = (list: ListType) => {
    setSelectedList(list)
    if (list === 'progress') {
      setSelectedCategory('general')
    }
  }

  return (
    <section className='h-full w-full bg-gray-lighten'>
      <div className='h-full pt-32 app:pt-72'>
        <header className='mb-32 flex items-center justify-between px-24'>
          <h1 className='text-28 font-bold'>도전 과제</h1>
          <ListTab selectedTab={selectedList} onTabChange={handleListChange} />
        </header>

        {selectedList === 'progress' && (
          <CategoryTab selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        )}

        {shouldShowError ? (
          <ChallengeListError />
        ) : displayView ? (
          <ChallengeListContent content={displayView} />
        ) : (
          <ChallengeListSkeleton />
        )}
      </div>
    </section>
  )
}

function ChallengeListContent({ content }: { content: ReadyChallengeView }) {
  if (content.view === 'completed') {
    return <CompletedList challenges={content.response.data} />
  }

  if (content.view === 'repetitive') {
    return <RepetitiveList challenges={content.response.data} />
  }

  return <GeneralList challenges={content.response.data} />
}

function ChallengeListSkeleton() {
  return (
    <section className='flex flex-col gap-8 p-16'>
      {Array.from({ length: CHALLENGE_LIST_SKELETON_COUNT }).map((_, index) => (
        <article key={index} className='h-80 rounded-8 bg-white px-16 py-10'>
          <section className='grid h-full w-full grid-cols-[60px_1fr_70px] place-items-center gap-8'>
            <div className='size-48 animate-pulse rounded-full bg-[#E4E6E8]' />
            <div className='h-16 w-full max-w-180 justify-self-start animate-pulse rounded-full bg-[#E4E6E8]' />
            <div className='h-40 w-70 animate-pulse rounded-8 bg-[#E4E6E8]' />
          </section>
        </article>
      ))}
    </section>
  )
}

function ChallengeListError() {
  return (
    <section className='pt-60'>
      <ErrorFallback type='medium' />
    </section>
  )
}

function getSelectedList(list: string | null): ListType {
  return list === 'progress' ? 'progress' : 'completed'
}

function getSelectedCategory(category: string | null): ProgressCategory {
  return category === 'repetitive' ? 'repetitive' : 'general'
}
