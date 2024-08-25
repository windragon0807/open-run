'use client'

import { useMutation } from 'react-query'

import { createBung } from '@apis/bungs/createBung/api'

export default function CreateBungButton() {
  const { mutate } = useMutation(createBung)
  return (
    <button
      className='px-20 py-10 text-white bg-primary rounded-8'
      onClick={() => {
        mutate({
          name: '벙 테스트',
          description: '벙 설명',
          location: '서울 어딘가',
          startDateTime: new Date(),
          endDateTime: new Date('2024-09-01'),
          distance: 10,
          pace: '5',
          memberNumber: 5,
          hasAfterRun: false,
          afterRunDescription: '뒷풀이 설명',
        })
      }}>
      {'[POST] /v1/bungs'}
    </button>
  )
}
