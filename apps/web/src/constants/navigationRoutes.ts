export const NAVIGATION_ROUTES = [
  { key: 'home', path: '/', href: '/' },
  { key: 'explore', path: '/explore', href: '/explore' },
  { key: 'challenges', path: '/challenges', href: '/challenges?list=progress&category=general' },
  { key: 'profile', path: '/profile', href: '/profile' },
] as const

export type NavigationRoutePath = (typeof NAVIGATION_ROUTES)[number]['path']

export function getNavigationRouteIndex(pathname: string): number | null {
  const index = NAVIGATION_ROUTES.findIndex((route) => route.path === pathname)
  return index === -1 ? null : index
}
