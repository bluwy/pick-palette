const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.svelte'],
  theme: {
    container: {
      center: true,
      padding: '1rem'
    },
    colors: {
      transparent: colors.transparent,
      current: colors.current,
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      primary: colors.purple,
      info: colors.blue,
      success: colors.green,
      warning: colors.yellow,
      error: colors.red
    },
    opacity: {
      '0': '0',
      '10': '.1',
      '20': '.2',
      '30': '.3',
      '40': '.4',
      '50': '.5',
      '60': '.6',
      '70': '.7',
      '80': '.8',
      '90': '.9',
      '100': '1'
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
          'sans-serif'
        ]
      },
      zIndex: {
        '-10': '-10',
        '-20': '-20',
        '-30': '-30',
        '-40': '-40',
        '-50': '-50'
      },
      cursor: {
        crosshair: 'crosshair',
        grab: 'grab'
      }
    }
  }
}
