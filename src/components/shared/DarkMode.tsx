'use client'

import { useEffect } from 'react'

export default function DarkMode() {
  useEffect(() => {
    // localStorage.setItem('theme', 'dark')
    // if (
    //   localStorage.getItem('theme') === 'dark' ||
    //   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    // ) {
    //   document.documentElement.classList.add('dark')
    // } else {
    //   document.documentElement.classList.remove('dark')
    // }
  }, [])

  return null
}
