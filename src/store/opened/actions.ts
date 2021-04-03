import { _openedProjectIds } from './state'

export function addOpenedProject(id: string) {
  _openedProjectIds.update((v) => v.concat([id]))
}

export function removeOpenedProject(id: string) {
_openedProjectIds.update((v) => v.filter((u) => u !== id))
}
