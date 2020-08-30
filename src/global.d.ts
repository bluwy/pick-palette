declare namespace svelte.JSX {
  //
  // Event Handler Types
  // ----------------------------------------------------------------------
  type EventHandler<E = Event, T = HTMLElement> = (
    event: E & { target: EventTarget & T }
  ) => any

  type CustomEventHandler<T, D = any> = EventHandler<CustomEvent<D>, T>
  type MouseEventHandler<T> = EventHandler<MouseEvent, T>

  interface HTMLAttributes<T> {
    onclickoutside?: MouseEventHandler<T>
    ondragenteronce?: CustomEventHandler<T>
    ondragleaveonce?: CustomEventHandler<T>
    onslide?: CustomEventHandler<T, { clientX: number; clientY: number }>
  }
}
