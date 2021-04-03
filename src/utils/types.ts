import type { Writable } from 'svelte/store'

export type WritableId = Writable<string | undefined>

export interface Color {
  id: string
  name: string
  shades: string[]
}

export interface ExportColor {
  id?: string
  name: string
  shades: string[]
}

export interface Project {
  id: string
  name: string
  version: number
  colors: Color[]
}

export interface ExportProject {
  id?: string
  name: string
  version: number
  colors: ExportColor[]
}
