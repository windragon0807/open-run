const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const sourcePath = path.join(__dirname, '../src/components/profile/Profile.tsx')
const source = fs.readFileSync(sourcePath, 'utf8')

test('profile header actions reuse the shared liquid glass surface', () => {
  assert.match(source, /import GlassSurface from '@shared\/GlassSurface'/)
  assert.match(source, /function ProfileActionGlass\(\{ children \}/)
  assert.match(source, /<GlassSurface\s+\{\.\.\.PROFILE_ACTION_GLASS_PROPS\}/)
})

test('profile header glass recipe has a soft gray tint on the flat profile background', () => {
  const glassPropsSource = source.match(/const PROFILE_ACTION_GLASS_PROPS = \{[\s\S]+?\} as const/)?.[0] ?? ''
  const glassStyleSource = source.match(/const PROFILE_ACTION_GLASS_STYLE = \{[\s\S]+?\} as const/)?.[0] ?? ''
  const glassSource = source.match(/function ProfileActionGlass[\s\S]+?\n}/)?.[0] ?? ''

  assert.match(glassPropsSource, /backgroundOpacity: 0\.28/)
  assert.match(glassPropsSource, /distortionScale: -135/)
  assert.match(glassPropsSource, /displace: 4/)
  assert.match(glassPropsSource, /greenOffset: 6/)
  assert.match(glassPropsSource, /blueOffset: 12/)
  assert.match(glassPropsSource, /saturation: 1\.8/)
  assert.match(glassPropsSource, /blur: 5/)
  assert.match(glassStyleSource, /0 6px 16px rgba\(17, 17, 26, 0\.1\)/)
  assert.match(glassSource, /bg-gray\/55 group-active:bg-gray\/70/)
  assert.match(glassSource, /from-white\/16 via-gray\/25 to-black-darken\/18/)
  assert.doesNotMatch(glassSource, /from-white\/30 via-white\/10/)
})

test('avatar action is a labelled link styled as the shared glass control', () => {
  assert.match(
    source,
    /<Link href='\/avatar' aria-label='아바타 페이지로 이동' className=\{PROFILE_ACTION_BUTTON_CLASS\}>/,
  )
  assert.doesNotMatch(source, /<Link href='\/avatar'>\s*<AvatarButton \/>/)
})

test('setting action is a labelled button styled as the shared glass control', () => {
  assert.match(source, /type='button'/)
  assert.match(source, /aria-label='설정 열기'/)
  assert.match(source, /className=\{PROFILE_ACTION_BUTTON_CLASS\}/)
  assert.match(source, /<ProfileActionGlass>\s*<SettingIcon/)
})

test('shared action class gives link controls a stable 40px flex box', () => {
  const actionClass = source.match(/const PROFILE_ACTION_BUTTON_CLASS =\n\s*'([^']+)'/)?.[1] ?? ''

  assert.match(actionClass, /\binline-flex\b/)
  assert.match(actionClass, /\baspect-square\b/)
  assert.match(actionClass, /\bw-40\b/)
})

test('completed bung copy is large enough to read in the compact profile card', () => {
  const completedBungSource = source.match(/function CompletedBung[\s\S]+?\n}/)?.[0] ?? ''

  assert.match(completedBungSource, /<span className='text-14 font-bold leading-\[1\.25\]'>\{title\}<\/span>/)
  assert.match(completedBungSource, /<span className='text-12 font-medium leading-\[1\.25\]'>\{location\}<\/span>/)
  assert.match(completedBungSource, /<span className='text-12 font-medium leading-\[1\.25\]'>\{date\}<\/span>/)
  assert.match(completedBungSource, /<button className='[^']*\btext-14\b/)
})
