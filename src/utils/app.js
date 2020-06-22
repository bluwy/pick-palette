/** Create color name, e.g. Color 1, Color 2... */
export function getDefaultColorName(project) {
  // Initial color suffix number
  let nameNumber = 1

  while (true) {
    const name = 'Color ' + nameNumber++

    if (!project.colors.some((v) => v.name === name)) {
      return name
    }
  }
}
