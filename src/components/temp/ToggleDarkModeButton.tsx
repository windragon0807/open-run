'use client'

import { toggleDarkMode } from '@utils/darkMode'

export default function ToggleDarkModeButton() {
  return (
    <button className='px-20 py-10 text-white bg-primary rounded-8 dark:bg-gray' onClick={toggleDarkMode}>
      다크모드
    </button>
  )
}
