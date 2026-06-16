const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const runStartedTextPath = path.join(__dirname, '../src/components/shared/RunStartedText.tsx')
const runStartedTextSource = fs.existsSync(runStartedTextPath) ? fs.readFileSync(runStartedTextPath, 'utf8') : ''
const runStartedStylesPath = path.join(__dirname, '../src/components/shared/RunStartedText.module.css')
const runStartedStylesSource = fs.existsSync(runStartedStylesPath) ? fs.readFileSync(runStartedStylesPath, 'utf8') : ''
const bungCardSource = fs.readFileSync(path.join(__dirname, '../src/components/home/BungCard.tsx'), 'utf8')
const bungDetailsSource = fs.readFileSync(path.join(__dirname, '../src/components/bung/BungDetails.tsx'), 'utf8')
const globalsSource = fs.readFileSync(path.join(__dirname, '../src/styles/globals.css'), 'utf8')

test('run started text owns the glitch label and pseudo-layer data text', () => {
  assert.match(runStartedTextSource, /const RUN_STARTED_TEXT = 'Run Started!'/)
  assert.match(runStartedTextSource, /data-text=\{RUN_STARTED_TEXT\}/)
  assert.match(runStartedTextSource, /className=\{clsx\(styles\.glitch/)
  assert.match(runStartedTextSource, /\{RUN_STARTED_TEXT\}/)
})

test('run started glitch animation is isolated in the shared component stylesheet', () => {
  assert.match(runStartedStylesSource, /\.glitch\s*\{/)
  assert.match(runStartedStylesSource, /content: attr\(data-text\)/)
  assert.match(runStartedStylesSource, /@keyframes run-started-signal/)
  assert.match(runStartedStylesSource, /@keyframes run-started-slice-a/)
  assert.match(runStartedStylesSource, /@keyframes run-started-slice-b/)
  assert.match(runStartedStylesSource, /@media \(prefers-reduced-motion: reduce\)/)
  assert.doesNotMatch(globalsSource, /run-started-glitch/)
})

test('home bung card reuses the shared run started text component', () => {
  assert.match(bungCardSource, /import RunStartedText from '@shared\/RunStartedText'/)
  assert.match(bungCardSource, /<RunStartedText className='mb-8 text-16' \/>/)
  assert.doesNotMatch(bungCardSource, /run-started-glitch/)
  assert.doesNotMatch(bungCardSource, /data-text=\{벙이시작되었는가/)
})

test('bung details reuses the shared run started text component', () => {
  assert.match(bungDetailsSource, /import RunStartedText from '@shared\/RunStartedText'/)
  assert.match(bungDetailsSource, /벙이진행중인가 \? \(\s*<RunStartedText className='top-6 text-14' \/>/)
  assert.doesNotMatch(bungDetailsSource, /'Run Started!' : formattedTime/)
})
