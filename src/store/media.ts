import { readable } from 'svelte/store'

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
}

export const breakpointSm = breakpointStore(breakpoints.sm)
export const breakpointMd = breakpointStore(breakpoints.md)
export const breakpointLg = breakpointStore(breakpoints.lg)
export const breakpointXl = breakpointStore(breakpoints.xl)

export const isTouchscreen = matchMediaStore('(pointer: coarse)')

function breakpointStore(minWidth: string) {
  return matchMediaStore(`(min-width: ${minWidth})`)
}

function matchMediaStore(query: string) {
  return readable(false, (set) => {
    const match = window.matchMedia(query)

    set(match.matches)

    match.onchange = (e) => set(e.matches)

    return () => (match.onchange = null)
  })
}
