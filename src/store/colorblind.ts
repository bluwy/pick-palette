import { writable } from 'svelte/store'
import type { Deficiency } from '@bjornlu/colorblind'

export const colorDeficiency = writable<Deficiency | undefined>(undefined)
