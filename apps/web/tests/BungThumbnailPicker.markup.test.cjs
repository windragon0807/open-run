const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const sourcePath = path.join(__dirname, '../src/components/bung/components/BungThumbnailPicker.tsx')
const source = fs.readFileSync(sourcePath, 'utf8')
const imageIconPath = path.join(__dirname, '../src/components/icons/image.tsx')
const imageIconSource = fs.readFileSync(imageIconPath, 'utf8')
const circleCheckIconPath = path.join(__dirname, '../src/components/icons/circle-check.tsx')
const circleCheckIconSource = fs.existsSync(circleCheckIconPath) ? fs.readFileSync(circleCheckIconPath, 'utf8') : ''

test('thumbnail action controls are grouped at the bottom right with a gap', () => {
  assert.match(source, /className='absolute bottom-16 right-16 flex gap-8'/)
})

test('background gallery opens as an overlay without pushing the form below', () => {
  assert.match(source, /<section className='relative z-20 mb-32'>/)
  assert.match(source, /'absolute left-0 right-0 top-\[calc\(100%\+12px\)\] z-30 rounded-8 border border-gray bg-white p-12 shadow-floating-primary/)
  assert.doesNotMatch(source, /className='mt-12 rounded-8 border border-gray bg-white p-12'/)
})

test('background gallery uses opacity and translate transitions instead of snapping open', () => {
  assert.match(source, /aria-hidden=\{!isGalleryOpen\}/)
  assert.match(source, /transition-\[opacity,transform\]/)
  assert.match(source, /duration-200/)
  assert.match(source, /ease-out/)
  assert.match(source, /isGalleryOpen\s*\?\s*'pointer-events-auto translate-y-0 opacity-100'/)
  assert.match(source, /:\s*'pointer-events-none -translate-y-2 opacity-0'/)
  assert.match(source, /disabled=\{!isGalleryOpen\}/)
  assert.doesNotMatch(source, /\{isGalleryOpen && \(/)
})

test('full background control uses an image svg icon instead of visible text', () => {
  assert.match(source, /import \{ ImageIcon \} from '@icons\/image'/)
  assert.match(source, /<ImageIcon size=\{24\} color=\{colors\.white\} \/>/)
  assert.doesNotMatch(source, />\s*\{isGalleryOpen \? '배경 닫기' : '전체 배경 보기'\}\s*</)
})

test('selected background uses a refined icon chip instead of text badge', () => {
  assert.match(source, /import \{ CircleCheckIcon \} from '@icons\/circle-check'/)
  assert.match(source, /aria-pressed=\{isSelected\}/)
  assert.match(source, /aria-label=\{isSelected \? `선택된 배경 \$\{index \+ 1\}` : `배경 \$\{index \+ 1\} 선택`\}/)
  assert.match(source, /absolute right-6 top-6 flex size-24 items-center justify-center rounded-8 border border-white\/70 bg-white\/85 text-primary shadow-\[0_2px_8px_rgba\(0,0,0,0\.14\)\] backdrop-blur-md/)
  assert.match(source, /<CircleCheckIcon size=\{16\} color=\{colors\.primary\.DEFAULT\} \/>/)
  assert.doesNotMatch(source, />\s*선택됨\s*</)
})

test('image icon uses the provided Lucide image SVG', () => {
  assert.match(imageIconSource, /viewBox='0 0 24 24'/)
  assert.match(imageIconSource, /stroke=\{color\}/)
  assert.match(imageIconSource, /strokeWidth=\{2\}/)
  assert.match(imageIconSource, /strokeLinecap='round'/)
  assert.match(imageIconSource, /strokeLinejoin='round'/)
  assert.match(imageIconSource, /<rect width=\{18\} height=\{18\} x=\{3\} y=\{3\} rx=\{2\} ry=\{2\} \/>/)
  assert.match(imageIconSource, /<circle cx=\{9\} cy=\{9\} r=\{2\} \/>/)
  assert.match(imageIconSource, /<path d='m21 15-3\.086-3\.086a2 2 0 0 0-2\.828 0L6 21' \/>/)
})

test('selected state icon uses the Lucide circle-check SVG', () => {
  assert.match(circleCheckIconSource, /viewBox='0 0 24 24'/)
  assert.match(circleCheckIconSource, /stroke=\{color\}/)
  assert.match(circleCheckIconSource, /strokeWidth=\{2\}/)
  assert.match(circleCheckIconSource, /strokeLinecap='round'/)
  assert.match(circleCheckIconSource, /strokeLinejoin='round'/)
  assert.match(circleCheckIconSource, /<circle cx=\{12\} cy=\{12\} r=\{10\} \/>/)
  assert.match(circleCheckIconSource, /<path d='m9 12 2 2 4-4' \/>/)
})

test('full background and random controls share the liquid glass button surface', () => {
  assert.match(source, /function ThumbnailGlassButton/)
  assert.equal((source.match(/<ThumbnailGlassButton/g) ?? []).length, 2)
  assert.match(source, /<GlassSurface[\s\S]*backgroundOpacity=\{0\.15\}[\s\S]*distortionScale=\{-100\}/)
})
