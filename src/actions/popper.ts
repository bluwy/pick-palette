// Temporary fork: https://github.com/bryanmylee/svelte-popperjs
import {
  createPopper,
  Instance,
  OptionsGeneric,
  Modifier
} from '@popperjs/core'
import { writable, Readable } from 'svelte/store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PopperOptions = Partial<OptionsGeneric<Partial<Modifier<any, any>>>>
type ReferenceAction = (
  node: HTMLElement
) => {
  destroy(): void
}
type ContentAction = (
  node: HTMLElement,
  popperOptions: PopperOptions
) => {
  update(popperOptions: PopperOptions): void
  destroy(): void
}

export function createPopperActions(): [
  ReferenceAction,
  ContentAction,
  Readable<Instance>
] {
  const popperInstance = writable(undefined as Instance | undefined)
  let referenceNode: HTMLElement
  let contentNode: HTMLElement
  let options: PopperOptions | undefined

  const popper: Readable<Instance | undefined> = {
    subscribe: popperInstance.subscribe
  }

  function initPopper() {
    if (referenceNode && contentNode) {
      popperInstance.set(createPopper(referenceNode, contentNode, options))
    }
  }

  function deinitPopper() {
    popperInstance.update((instance) => {
      if (instance != null) {
        instance.destroy()
        return undefined
      }

      return instance
    })
  }

  function referenceAction(node: HTMLElement) {
    referenceNode = node
    initPopper()
    return {
      destroy() {
        deinitPopper()
      }
    }
  }

  function contentAction(node: HTMLElement, popperOptions?: PopperOptions) {
    contentNode = node
    options = popperOptions
    initPopper()
    return {
      update(popperOptions: PopperOptions) {
        options = popperOptions
        popperInstance.update((instance) => {
          instance.setOptions(options)
          return instance
        })
      },
      destroy() {
        deinitPopper()
      }
    }
  }

  return [referenceAction, contentAction, popper]
}
