import { Writable } from 'svelte/store'

export type WritableId = Writable<string | undefined>

export interface Color {
  id: string
  name: string
  shades: string[]
}

export interface Project {
  id: string
  name: string
  version: number
  colors: Color[]
}
