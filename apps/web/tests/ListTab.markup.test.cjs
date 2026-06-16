const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const sourcePath = path.join(__dirname, '../src/components/challenges/ListTab.tsx')
const source = fs.readFileSync(sourcePath, 'utf8')

test('active tab indicator keeps a visible inset inside the outer pill', () => {
  const indicatorClass = source.match(/<motion\.div\s+className='([^']+)'/)?.[1] ?? ''

  assert.match(indicatorClass, /\bleft-3\b/)
  assert.match(indicatorClass, /\btop-3\b/)
  assert.match(indicatorClass, /\bh-28\b/)
})

test('active tab indicator width accounts for left and right inset', () => {
  assert.match(source, /width:\s*currentTab === 'progress'\s*\?\s*70\s*:\s*37/)
})

test('outer pill provides a visible surface around the active indicator', () => {
  const buttonClass = source.match(/<button\s+className='([^']+)'/)?.[1] ?? ''

  assert.match(buttonClass, /\bbg-gray-lighten\b/)
})
