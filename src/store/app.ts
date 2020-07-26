import { writable } from 'svelte/store'
import { readonly } from '/@/utils/common'

const _showColorPanel = writable(false)

export const showColorPanel = readonly(_showColorPanel)

export function setShowColorPanel(v: boolean) {
  _showColorPanel.set(v)
}
