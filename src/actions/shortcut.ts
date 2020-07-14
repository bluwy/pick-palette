import Mousetrap from 'mousetrap'

type SetupFunction = (on: MousetrapStatic['bind']) => void

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
