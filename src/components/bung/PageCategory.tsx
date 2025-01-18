'use client'

import { useState } from 'react'
import Layout from '@shared/Layout'
import { BungDetail } from '@/types/bung'
import BungDetails from './BungDetails'
import { PageCategory } from './types'
import ManageMembers from './ManageMembers'
import DelegateOwner from './DelegateOwner'

export default function PageCategory({
  details,
  isParticipated,
  isOwner,
}: {
  details: BungDetail
  isParticipated: boolean
  isOwner: boolean
}) {
  const [pageCategory, setPageCategory] = useState<PageCategory>('벙 상세')

  return (
    <Layout>
      {pageCategory === '벙 상세' && (
        <BungDetails
          details={details}
          isParticipated={isParticipated}
          isOwner={isOwner}
          setPageCategory={setPageCategory}
        />
      )}
      {pageCategory === '멤버관리' && (
        <ManageMembers memberList={details.memberList} setPageCategory={setPageCategory} />
      )}
      {pageCategory === '벙주 넘기기' && (
        <DelegateOwner
          memberList={details.memberList.filter(({ owner }) => !owner)}
          setPageCategory={setPageCategory}
        />
      )}
    </Layout>
  )
}
