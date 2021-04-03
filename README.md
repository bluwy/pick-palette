# Pick Palette

[![Netlify Status](https://api.netlify.com/api/v1/badges/199bb34b-fdb9-49f6-af77-885e7b844f7f/deploy-status)](https://app.netlify.com/sites/pick-palette/deploys)

A color palette manager made with [Svelte](https://svelte.dev/)!

[**View website**](https://pick-palette.netlify.app)

## Features

- Smooth transitions done purely with [`svelte/transition`](https://svelte.dev/tutorial/transition)
- Custom-built color picker with support for h, s, v, r, g, b modes
- Custom-built drag-and-drop color tabs
- Fullscreen file input
- Full undo/redo functionality with [Immer](https://github.com/immerjs/immer)
- Data is all kept in local storage
- Multi-tab support with local storage synchronization
- Keyboard shortcuts with [Mousetrap](https://github.com/ccampbell/mousetrap)
- Project import/export file with validation
- Routing with [@bjornlu/svelte-router](https://github.com/bluwy/svelte-router)
- Color blindness simulation with [@bjornlu/colorblind](https://github.com/bluwy/colorblind)
- Developed with [Vite](https://github.com/vitejs/vite), [TypeScript](https://typescriptlang.org/) and [Windi CSS](https://github.com/windicss/windicss)

## Notes

- Snackbar is never used
- State management is separated to `state`, `actions`, `effects` and `utils` ([Explanation](https://www.reddit.com/r/sveltejs/comments/itu9o7/keeping_organized/g5hj74p/?context=3))
- Color picker isn't perfect but functional. Defects include:
  - Color box gradient is inaccurate in different browsers
  - Dispatched changes aren't properly throttled
- Default generated shades is only OK looking

## Development

Install dependencies with `pnpm install`.

```bash
# Start dev server
$ pnpm dev

# Build for production
$ pnpm build

# Preview production build
$ pnpm serve

# Format code with Prettier
$ pnpm format
```

Code is auto-formatted on each `git push` with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged).

## License

MIT
