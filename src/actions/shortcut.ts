import Mousetrap from 'mousetrap'

export type SetupFunction = (on: Mousetrap.MousetrapStatic['bind']) => void

/** Capture key bindings */
export function shortcut(node: HTMLElement, setup: SetupFunction) {
  const trap = Mousetrap(node)

  setup(trap.bind.bind(trap))

  return {
    destroy() {
      trap.reset()
    }
  }
}
