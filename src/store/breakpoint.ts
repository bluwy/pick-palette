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

function breakpointStore(minWidth: string) {
  return readable(false, (set) => {
    const match = window.matchMedia(`(min-width: ${minWidth})`)

    set(match.matches)

    match.onchange = (e) => set(e.matches)

    return () => (match.onchange = null)
  })
}
