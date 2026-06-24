import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'

export default function useFuseSearch<T>(list: T[], key: keyof T extends string ? keyof T : never) {
  const [search, setSearch] = useState('')
  const [filteredList, setFilteredList] = useState(list)

  const fuseOptions = useMemo(
    () => ({
      keys: [key],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 1,
    }),
    [key],
  )

  useEffect(() => {
    if (!search.trim()) {
      setFilteredList(list)
      return
    }

    const fuse = new Fuse(list, fuseOptions)
    const results = fuse.search(search)
    setFilteredList(results.map((result) => result.item))
  }, [fuseOptions, list, search])

  return { search, setSearch, filteredList }
}
