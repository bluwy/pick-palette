import Mousetrap from 'mousetrap'

/**
 * On key press
 * @callback OnKeyPress
 * @param {string | string[]} key The key binding
 * @param {function(MouseEvent)} fn Callback when key press match
 * @returns {void}
 */

/**
 * Capture key bindings
 * @param {HTMLElement} node
 * @param {function(OnKeyPress): void} setup
 */
export function shortcut(node, setup) {
  const trap = Mousetrap(node)

  setup(trap.bind.bind(trap))

  return {
    destroy() {
      trap.reset()
    }
  }
}
