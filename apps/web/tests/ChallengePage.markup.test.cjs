const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const sourcePath = path.join(__dirname, '../src/components/challenges/ChallengePage.tsx')
const source = fs.readFileSync(sourcePath, 'utf8')
const skeletonSource = source.match(/function ChallengeListSkeleton\(\) \{([\s\S]*?)\n\}\n\nfunction ChallengeListError/)?.[1] ?? ''

test('challenge list skeleton uses the inner reward circle size for the left placeholder', () => {
  assert.match(skeletonSource, /className='[^']*\bsize-48\b[^']*\brounded-full\b[^']*'/)
})

test('challenge list skeleton gives the title placeholder a slightly taller height', () => {
  assert.match(skeletonSource, /className='[^']*\bh-16\b[^']*\bmax-w-180\b[^']*'/)
})

test('challenge list skeleton uses the same lower-saturation gray for all inner placeholders', () => {
  const placeholderClasses = [...skeletonSource.matchAll(/<div className='([^']*\banimate-pulse\b[^']*)' \/>/g)].map(
    ([, className]) => className,
  )

  assert.equal(placeholderClasses.length, 3)
  assert.ok(placeholderClasses.every((className) => className.includes('bg-[#E4E6E8]')))
})
