const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const avatarPageSource = fs.readFileSync(path.join(__dirname, '../src/components/avatar/AvatarPage.tsx'), 'utf8')
const avatarPageSkeletonSource = fs.readFileSync(
  path.join(__dirname, '../src/components/avatar/AvatarPageSkeleton.tsx'),
  'utf8',
)
const avatarThumbnailSource = fs.readFileSync(
  path.join(__dirname, '../src/components/avatar/AvatarThumbnail.tsx'),
  'utf8',
)
const saveIconPath = path.join(__dirname, '../src/components/icons/save.tsx')
const saveIconSource = fs.existsSync(saveIconPath) ? fs.readFileSync(saveIconPath, 'utf8') : ''
const eraserIconPath = path.join(__dirname, '../src/components/icons/eraser.tsx')
const eraserIconSource = fs.existsSync(eraserIconPath) ? fs.readFileSync(eraserIconPath, 'utf8') : ''

test('avatar page header title is concise', () => {
  assert.match(avatarPageSource, /<h1 className='text-16 font-bold text-black'>아바타<\/h1>/)
  assert.doesNotMatch(avatarPageSource, />아바타 변경</)
})

test('avatar page skeleton header title matches the page title', () => {
  assert.match(avatarPageSkeletonSource, /<h1 className='text-16 font-bold text-black'>아바타<\/h1>/)
  assert.doesNotMatch(avatarPageSkeletonSource, />아바타 변경</)
})

test('avatar page skeleton uses a smaller static OpenRun logo', () => {
  assert.match(avatarPageSkeletonSource, /<TransparentOpenrunIcon[\s\S]*size=\{132\}/)
  assert.doesNotMatch(avatarPageSkeletonSource, /size=\{160\}/)
})

test('avatar page skeleton placeholders do not pulse', () => {
  assert.doesNotMatch(avatarPageSkeletonSource, /import Skeleton from '@shared\/Skeleton'/)
  assert.doesNotMatch(avatarPageSkeletonSource, /<Skeleton\b/)
  assert.doesNotMatch(avatarPageSkeletonSource, /animate-pulse/)
  assert.match(avatarPageSkeletonSource, /className='absolute left-16 h-32 w-32 -translate-x-4 rounded-8 bg-gray'/)
  assert.match(avatarPageSkeletonSource, /className='absolute right-16 h-28 w-42 translate-x-8 rounded-8 bg-gray'/)
})

test('avatar save action uses the provided save icon instead of visible text', () => {
  assert.match(avatarPageSource, /import \{ SaveIcon \} from '@icons\/save'/)
  assert.match(avatarPageSource, /aria-label='아바타 저장'/)
  assert.match(avatarPageSource, /<SaveIcon size=\{24\} color=\{colors\.black\.darken\} \/>/)
  assert.doesNotMatch(avatarPageSource, /<span className='text-14 text-black'>저장<\/span>/)
})

test('save icon matches the provided Lucide save SVG', () => {
  assert.match(saveIconSource, /export function SaveIcon/)
  assert.match(saveIconSource, /viewBox='0 0 24 24'/)
  assert.match(saveIconSource, /stroke=\{color\}/)
  assert.match(saveIconSource, /strokeWidth=\{2\}/)
  assert.match(saveIconSource, /strokeLinecap='round'/)
  assert.match(saveIconSource, /strokeLinejoin='round'/)
  assert.match(saveIconSource, /<path d='M15\.2 3a2 2 0 0 1 1\.4\.6l3\.8 3\.8a2 2 0 0 1 \.6 1\.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z' \/>/)
  assert.match(saveIconSource, /<path d='M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7' \/>/)
  assert.match(saveIconSource, /<path d='M7 3v4a1 1 0 0 0 1 1h7' \/>/)
})

test('avatar clear action uses the provided eraser icon', () => {
  assert.match(avatarPageSource, /import \{ EraserIcon \} from '@icons\/eraser'/)
  assert.match(avatarPageSource, /const handleClearAvatar = \(\) => \{\s*setSelectedAvatar\(EMPTY_WEARING_AVATAR\)\s*\}/)
  assert.match(avatarPageSource, /aria-label='아바타 전체 해제'/)
  assert.match(avatarPageSource, /onClick=\{handleClearAvatar\}/)
  assert.match(avatarPageSource, /<EraserIcon size=\{24\} color=\{colors\.black\.darken\} \/>/)
})

test('avatar restore action reuses the previous reset icon as undo', () => {
  assert.match(
    avatarPageSource,
    /const handleRestoreWearingAvatar = \(\) => \{\s*setSelectedAvatar\(wearingAvatar\?\.data \?\? EMPTY_WEARING_AVATAR\)\s*\}/,
  )
  assert.match(avatarPageSource, /aria-label='원래 착용 아바타로 되돌리기'/)
  assert.match(avatarPageSource, /onClick=\{handleRestoreWearingAvatar\}/)
  assert.match(avatarPageSource, /<ResetIcon \/>/)
})

test('avatar undo and clear actions are stacked on the right edge', () => {
  assert.match(avatarPageSource, /className='absolute bottom-8 right-8 flex flex-col gap-8'/)
  assert.match(
    avatarPageSource,
    /aria-label='원래 착용 아바타로 되돌리기'[\s\S]*<ResetIcon \/>[\s\S]*aria-label='아바타 전체 해제'[\s\S]*<EraserIcon size=\{24\} color=\{colors\.black\.darken\} \/>/,
  )
})

test('eraser icon matches the provided Lucide eraser SVG', () => {
  assert.match(eraserIconSource, /export function EraserIcon/)
  assert.match(eraserIconSource, /viewBox='0 0 24 24'/)
  assert.match(eraserIconSource, /stroke=\{color\}/)
  assert.match(eraserIconSource, /strokeWidth=\{2\}/)
  assert.match(eraserIconSource, /strokeLinecap='round'/)
  assert.match(eraserIconSource, /strokeLinejoin='round'/)
  assert.match(
    eraserIconSource,
    /<path d='M21 21H8a2 2 0 0 1-1\.42-\.587l-3\.994-3\.999a2 2 0 0 1 0-2\.828l10-10a2 2 0 0 1 2\.829 0l5\.999 6a2 2 0 0 1 0 2\.828L12\.834 21' \/>/,
  )
  assert.match(eraserIconSource, /<path d='m5\.082 11\.09 8\.828 8\.828' \/>/)
})

test('avatar thumbnail loading state uses a pulsing gray OpenRun logo', () => {
  assert.match(avatarThumbnailSource, /import \{ BackgroundOpenrunIcon \} from '@icons\/openrun'/)
  assert.match(avatarThumbnailSource, /className='h-auto animate-pulse opacity-\[0\.45\]'/)
  assert.match(avatarThumbnailSource, /<BackgroundOpenrunIcon size=\{54\} color=\{colors\.gray\.darken\}/)
  assert.doesNotMatch(avatarThumbnailSource, /top-\[28px\]/)
  assert.doesNotMatch(avatarThumbnailSource, /rounded-\[22px_22px_12px_12px\]/)
})
