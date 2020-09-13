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
- Developed with [Svite](https://github.com/dominikg/svite), [TypeScript](https://typescriptlang.org/) and [TailwindCSS](https://tailwindcss.com/)

## Note

- Snackbar is never used
- State management is separated to `state`, `actions`, `effects` and `utils`
- Color picker isn't perfect but functional. Defects include:
  - Color box gradient looks awful and inaccurate in different browsers
  - Dispatched changes aren't properly throttled
- Default generated shades is only OK looking
- Minified JS code still has comments, waiting for `vite@1.0.0-rc.5` terser options

## Development

Install dependencies with `yarn install`.

```bash
# Start dev server
$ yarn dev

# Build for production
$ yarn build

# Format code with Prettier
$ yarn format
```

Code is auto-formatted on each `git push` with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged).

## License

MIT
