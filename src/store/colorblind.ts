import { writable } from 'svelte/store'
import { Deficiency } from '@bjornlu/colorblind'

export const colorDeficiency = writable<Deficiency | undefined>(undefined)
