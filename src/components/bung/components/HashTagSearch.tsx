import { useEffect, useState } from 'react'
import Input from '@shared/Input'
import useDebounce from '@hooks/useDebounce'
import { useHashtagsMutation } from '@apis/bungs/fetchHashtags/query'

export default function HashTagSearch({ onTagClick }: { onTagClick?: (tag: string) => void }) {
  const [inputValue, setInputValue] = useState('')
  const debouncedTag = useDebounce(inputValue, 300)
  const [recommendHashTags, setRecommendHashTags] = useState<string[]>([])

  const { mutate: fetchHashtags } = useHashtagsMutation()

  // 지연 적용 하기
  useEffect(() => {
    if (debouncedTag !== '') {
      fetchHashtags(
        { tag: debouncedTag },
        {
          onSuccess: ({ data }) => {
            const sliced = data.slice(0, 2)
            setRecommendHashTags([`${debouncedTag} (직접 입력)`, ...sliced])
          },
        },
      )
    } else {
      setRecommendHashTags([])
    }
  }, [debouncedTag, fetchHashtags])

  return (
    <div className='relative'>
      <Input type='text' placeholder='해시태그를 입력하세요' value={inputValue} setValue={setInputValue} />
      <ul className='absolute top-45 w-full rounded-8 bg-white shadow-floating-primary'>
        {recommendHashTags.map((tag) => (
          <li
            key={tag}
            className='text-black block cursor-pointer py-10 pl-16 text-14 hover:text-primary'
            onClick={() => {
              onTagClick?.(tag.replace(' (직접 입력)', ''))
              setInputValue('')
            }}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}
