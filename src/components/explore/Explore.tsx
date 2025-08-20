'use client'

import { useState } from 'react'
import ExploreHome from './ExploreHome'
import ExploreSearch from './ExploreSearch'

export default function Explore() {
  const [isSearchMode, setIsSearchMode] = useState(false)
  return !isSearchMode ? (
    <ExploreHome onSearchButtonClick={() => setIsSearchMode(true)} />
  ) : (
    <ExploreSearch onCancelButtonClick={() => setIsSearchMode(false)} />
  )
}
